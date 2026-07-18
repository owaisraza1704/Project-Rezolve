from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.auth.dependencies import get_db_session
from app.services.auth.dependencies import get_current_profile
from app.services.auth.resolver_applications import create_resolver_application
from app.services.auth.resolver_applications import get_resolver_applications_for_profile
from app.services.auth.schemas.profile import ProfileResponse
from app.services.auth.schemas.resolver_application import ResolverApplicationResponse
from app.services.auth.schemas.resolver_application import ResolverApplicationSubmission

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.get("/me", response_model=ProfileResponse)
async def get_me(
    profile=Annotated[object, Depends(get_current_profile)],
):
    return ProfileResponse(
        id=profile.id,
        auth_user_id=profile.auth_user_id,
        email=profile.email,
        name=profile.name,
        role=profile.role,
    )


@router.post(
    "/resolver-applications",
    response_model=ResolverApplicationResponse,
    status_code=201,
)
async def submit_resolver_application(
    payload: ResolverApplicationSubmission,
    profile=Annotated[object, Depends(get_current_profile)],
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
    )


@router.get(
    "/resolver-applications/me",
    response_model=list[ResolverApplicationResponse],
)
async def get_my_resolver_applications(
    profile=Annotated[object, Depends(get_current_profile)],
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
        )
        for application in applications
    ]
