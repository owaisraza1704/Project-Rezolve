from functools import lru_cache

from fastapi import HTTPException
import jwt
from jwt import ExpiredSignatureError
from jwt import InvalidTokenError
from jwt import PyJWKClient
from jwt import PyJWKClientError
from starlette import status

from app.services.auth.config import AuthConfig


def extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header.",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format.",
        )

    return token


def verify_supabase_token(token: str) -> dict:
    jwks_url = AuthConfig.supabase_jwks_url()
    issuer = AuthConfig.supabase_auth_issuer()

    if not jwks_url or not issuer:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_URL is not configured.",
        )

    try:
        signing_key = _get_supabase_jwk_client(jwks_url).get_signing_key_from_jwt(token)

        return jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            issuer=issuer,
            options={"verify_aud": False},
        )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
        )
    except PyJWKClientError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to resolve Supabase signing key for token.",
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid JWT token.",
        )


@lru_cache(maxsize=1)
def _get_supabase_jwk_client(jwks_url: str) -> PyJWKClient:
    return PyJWKClient(jwks_url)
