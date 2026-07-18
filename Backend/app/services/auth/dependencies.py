from typing import Annotated

from fastapi import Depends
from fastapi import Header
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.db.connection import AsyncSessionLocal
from app.services.auth.profiles import get_or_create_profile_by_auth_payload
from app.services.auth.security import extract_bearer_token
from app.services.auth.security import verify_supabase_token


async def get_bearer_token(
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    return extract_bearer_token(authorization)


async def get_auth_payload(
    authorization: Annotated[str | None, Header()] = None,
) -> dict:
    token = extract_bearer_token(authorization)
    return verify_supabase_token(token)


async def get_db_session():
    async with AsyncSessionLocal() as session:
        yield session


async def get_current_profile(
    auth_payload: Annotated[dict, Depends(get_auth_payload)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
):
    return await get_or_create_profile_by_auth_payload(db, auth_payload)


def require_role(*allowed_roles: str):
    async def dependency(
        profile=Depends(get_current_profile),
    ):
        if profile.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )

        return profile

    return dependency


async def get_current_resolver_profile(
    profile=Annotated[object, Depends(require_role("resolver"))],
):
    return profile


async def get_current_admin_profile(
    profile=Annotated[object, Depends(require_role("admin"))],
):
    return profile
