"""Auth service boundary for Rezolve."""

from app.services.auth.admin_routes import router as admin_router
from app.services.auth.routes import router

__all__ = ["admin_router", "router"]
