from typing import Annotated

from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.db.connection import AsyncSessionLocal
from app.services.auth.profiles import get_or_create_profile_by_auth_payload
from app.services.auth.security import verify_supabase_token

bearer_scheme = HTTPBearer(auto_error=False)


async def get_bearer_token(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)] = None,
) -> str:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header.",
        )

    if credentials.scheme.lower() != "bearer" or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format.",
        )

    return credentials.credentials


async def get_auth_payload(
    token: Annotated[str, Depends(get_bearer_token)],
) -> dict:
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
    profile: Annotated[object, Depends(require_role("resolver"))],
):
    return profile


async def get_current_admin_profile(
    profile: Annotated[object, Depends(require_role("admin"))],
):
    return profile
