from typing import Annotated
import json
from urllib import error as urllib_error
from urllib import request as urllib_request

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.services.auth.config import AuthConfig
from app.services.auth.dependencies import get_db_session
from app.services.auth.dependencies import get_current_profile
from app.services.auth.profiles import create_profile
from app.services.auth.resolver_applications import create_resolver_application
from app.services.auth.resolver_applications import get_resolver_applications_for_profile
from app.services.auth.schemas.profile import ProfileResponse
from app.services.auth.schemas.resolver_application import PublicResolverOnboardingSubmission
from app.services.auth.schemas.resolver_application import ResolverApplicationResponse
from app.services.auth.schemas.resolver_application import ResolverApplicationSubmission

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post(
    "/resolver-onboarding",
    response_model=ResolverApplicationResponse,
    status_code=201,
)
async def submit_public_resolver_onboarding(
    payload: PublicResolverOnboardingSubmission,
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    auth_user = _create_supabase_auth_user(
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name,
    )
    profile = await create_profile(
        db,
        auth_user_id=auth_user["id"],
        email=payload.email,
        name=payload.full_name,
    )
    application = await create_resolver_application(
        db,
        profile.id,
        ResolverApplicationSubmission(
            motivation=payload.motivation,
            experience_summary=payload.experience_summary,
            skills=payload.skills,
            availability=payload.availability,
        ),
    )
    return ResolverApplicationResponse(
        id=application.id,
        profile_id=application.profile_id,
        status=application.status,
        motivation=application.motivation,
        experience_summary=application.experience_summary,
        skills=application.skills,
        availability=application.availability,
        review_notes=application.review_notes,
        reviewed_by=application.reviewed_by,
        created_at=application.created_at,
    )


@router.get("/me", response_model=ProfileResponse)
async def get_me(
    profile: Annotated[object, Depends(get_current_profile)],
):
    return ProfileResponse(
        id=profile.id,
        auth_user_id=profile.auth_user_id,
        email=profile.email,
        name=profile.name,
        role=profile.role,
        created_at=profile.created_at,
    )


@router.post(
    "/resolver-applications",
    response_model=ResolverApplicationResponse,
    status_code=201,
)
async def submit_resolver_application(
    payload: ResolverApplicationSubmission,
    profile: Annotated[object, Depends(get_current_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    application = await create_resolver_application(db, profile.id, payload)
    return ResolverApplicationResponse(
        id=application.id,
        profile_id=application.profile_id,
        status=application.status,
        motivation=application.motivation,
        experience_summary=application.experience_summary,
        skills=application.skills,
        availability=application.availability,
        review_notes=application.review_notes,
        reviewed_by=application.reviewed_by,
        created_at=application.created_at,
    )


@router.get(
    "/resolver-applications/me",
    response_model=list[ResolverApplicationResponse],
)
async def get_my_resolver_applications(
    profile: Annotated[object, Depends(get_current_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    applications = await get_resolver_applications_for_profile(db, profile.id)
    return [
        ResolverApplicationResponse(
            id=application.id,
            profile_id=application.profile_id,
            status=application.status,
            motivation=application.motivation,
            experience_summary=application.experience_summary,
            skills=application.skills,
            availability=application.availability,
            review_notes=application.review_notes,
            reviewed_by=application.reviewed_by,
            created_at=application.created_at,
        )
        for application in applications
    ]


def _create_supabase_auth_user(*, email: str, password: str, full_name: str) -> dict:
    if not AuthConfig.supabase_url or not AuthConfig.supabase_service_role_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase service role credentials are not configured.",
        )

    endpoint = f"{AuthConfig.supabase_url.rstrip('/')}/auth/v1/admin/users"
    body = json.dumps(
        {
            "email": email,
            "password": password,
            "user_metadata": {
                "name": full_name,
                "full_name": full_name,
            },
        }
    ).encode("utf-8")
    request = urllib_request.Request(
        endpoint,
        data=body,
        headers={
            "Content-Type": "application/json",
            "apikey": AuthConfig.supabase_service_role_key,
            "Authorization": f"Bearer {AuthConfig.supabase_service_role_key}",
        },
        method="POST",
    )

    try:
        with urllib_request.urlopen(request) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib_error.HTTPError as exc:
        detail = "Unable to create account."
        try:
            error_payload = json.loads(exc.read().decode("utf-8"))
            detail = (
                error_payload.get("msg")
                or error_payload.get("message")
                or error_payload.get("error_description")
                or error_payload.get("error")
                or detail
            )
        except Exception:
            pass
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )
    except urllib_error.URLError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to reach Supabase auth service.",
        )

    user = payload.get("user") if isinstance(payload, dict) else None
    if not user or not user.get("id"):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase account creation did not return a user id.",
        )

    return user
