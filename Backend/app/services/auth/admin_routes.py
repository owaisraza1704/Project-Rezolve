from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.services.auth.dependencies import get_current_admin_profile
from app.services.auth.dependencies import get_db_session
from app.services.auth.profiles import delete_profile_by_role
from app.services.auth.profiles import list_profiles_by_role
from app.services.auth.resolver_applications import approve_resolver_application
from app.services.auth.resolver_applications import get_all_resolver_applications
from app.services.auth.resolver_applications import get_resolver_application_by_id
from app.services.auth.resolver_applications import reject_resolver_application
from app.services.auth.schemas.admin import AdminDeleteResponse
from app.services.auth.schemas.profile import ProfileResponse
from app.services.auth.schemas.resolver_application import ResolverApplicationReview
from app.services.auth.schemas.resolver_application import ResolverApplicationResponse

router = APIRouter(prefix="/api/v1/admin/auth", tags=["auth-admin"])


@router.get(
    "/users",
    response_model=list[ProfileResponse],
)
async def list_users(
    profile: Annotated[object, Depends(get_current_admin_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    _ = profile
    users = await list_profiles_by_role(db, "user")
    return [
        ProfileResponse(
            id=user.id,
            auth_user_id=user.auth_user_id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at,
        )
        for user in users
    ]


@router.get(
    "/resolvers",
    response_model=list[ProfileResponse],
)
async def list_resolvers(
    profile: Annotated[object, Depends(get_current_admin_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    _ = profile
    resolvers = await list_profiles_by_role(db, "resolver")
    return [
        ProfileResponse(
            id=resolver.id,
            auth_user_id=resolver.auth_user_id,
            email=resolver.email,
            name=resolver.name,
            role=resolver.role,
            created_at=resolver.created_at,
        )
        for resolver in resolvers
    ]


@router.get(
    "/resolver-applications",
    response_model=list[ResolverApplicationResponse],
)
async def list_resolver_applications(
    profile: Annotated[object, Depends(get_current_admin_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    _ = profile
    applications = await get_all_resolver_applications(db)
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


@router.post(
    "/resolver-applications/{application_id}/approve",
    response_model=ResolverApplicationResponse,
)
async def approve_application(
    application_id: int,
    payload: ResolverApplicationReview,
    profile: Annotated[object, Depends(get_current_admin_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    application = await get_resolver_application_by_id(db, application_id)
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resolver application was not found.",
        )

    application = await approve_resolver_application(db, application, profile.id, payload)
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


@router.post(
    "/resolver-applications/{application_id}/reject",
    response_model=ResolverApplicationResponse,
)
async def reject_application(
    application_id: int,
    payload: ResolverApplicationReview,
    profile: Annotated[object, Depends(get_current_admin_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    application = await get_resolver_application_by_id(db, application_id)
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resolver application was not found.",
        )

    application = await reject_resolver_application(db, application, profile.id, payload)
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


@router.delete(
    "/users/{profile_id}",
    response_model=AdminDeleteResponse,
)
async def delete_user(
    profile_id: int,
    profile: Annotated[object, Depends(get_current_admin_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    _ = profile
    deleted_profile = await delete_profile_by_role(db, profile_id, "user")
    return AdminDeleteResponse(
        id=deleted_profile.id,
        role=deleted_profile.role,
        detail="User deleted successfully.",
    )


@router.delete(
    "/resolvers/{profile_id}",
    response_model=AdminDeleteResponse,
)
async def delete_resolver(
    profile_id: int,
    profile: Annotated[object, Depends(get_current_admin_profile)],
    db: Annotated[AsyncSession, Depends(get_db_session)] = None,
):
    _ = profile
    deleted_profile = await delete_profile_by_role(db, profile_id, "resolver")
    return AdminDeleteResponse(
        id=deleted_profile.id,
        role=deleted_profile.role,
        detail="Resolver deleted successfully.",
    )
