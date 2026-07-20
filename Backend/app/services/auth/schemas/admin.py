from pydantic import BaseModel


class AdminDeleteResponse(BaseModel):
    id: int
    role: str
    detail: str
