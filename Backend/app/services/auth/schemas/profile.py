from datetime import datetime

from pydantic import BaseModel


class ProfileResponse(BaseModel):
    id: int
    auth_user_id: str
    email: str | None = None
    name: str | None = None
    role: str
    created_at: datetime
