from sqlalchemy import BigInteger
from sqlalchemy import DateTime
from sqlalchemy import Text
from sqlalchemy import func
from sqlalchemy import text
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    auth_user_id: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    email: Mapped[str | None] = mapped_column(Text)
    name: Mapped[str | None] = mapped_column(Text)
    role: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="user",
        server_default=text("'user'"),
    )
    created_at: Mapped[object] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
