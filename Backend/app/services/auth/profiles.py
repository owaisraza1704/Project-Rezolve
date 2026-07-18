from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.services.auth.models.profile import Profile


def get_auth_user_id_from_payload(auth_payload: dict) -> str:
    auth_user_id = auth_payload.get("sub")
    if not auth_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing the subject claim.",
        )

    return auth_user_id


async def get_profile_by_auth_payload(
    db: AsyncSession,
    auth_payload: dict,
) -> Profile | None:
    auth_user_id = get_auth_user_id_from_payload(auth_payload)

    result = await db.execute(
        select(Profile).where(Profile.auth_user_id == auth_user_id)
    )
    return result.scalar_one_or_none()


def _get_profile_email_from_payload(auth_payload: dict) -> str | None:
    return auth_payload.get("email")


def _get_profile_name_from_payload(auth_payload: dict) -> str | None:
    user_metadata = auth_payload.get("user_metadata") or {}
    return (
        user_metadata.get("name")
        or user_metadata.get("full_name")
        or auth_payload.get("name")
    )


async def get_or_create_profile_by_auth_payload(
    db: AsyncSession,
    auth_payload: dict,
) -> Profile:
    profile = await get_profile_by_auth_payload(db, auth_payload)
    auth_user_id = get_auth_user_id_from_payload(auth_payload)
    email = _get_profile_email_from_payload(auth_payload)
    name = _get_profile_name_from_payload(auth_payload)

    if profile is None:
        profile = Profile(
            auth_user_id=auth_user_id,
            email=email,
            name=name,
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        return profile

    updated = False
    if email != profile.email:
        profile.email = email
        updated = True
    if name != profile.name:
        profile.name = name
        updated = True

    if updated:
        await db.commit()
        await db.refresh(profile)

    return profile
