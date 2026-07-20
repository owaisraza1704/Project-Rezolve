from sqlalchemy import BigInteger
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Text
from sqlalchemy import func
from sqlalchemy import text
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base


class ResolverApplication(Base):
    __tablename__ = "resolver_applications"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"), nullable=False)
    status: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="pending",
        server_default=text("'pending'"),
    )
    motivation: Mapped[str] = mapped_column(Text, nullable=False)
    experience_summary: Mapped[str | None] = mapped_column(Text)
    skills: Mapped[str | None] = mapped_column(Text)
    availability: Mapped[str | None] = mapped_column(Text)
    review_notes: Mapped[str | None] = mapped_column(Text)
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey("profiles.id"))
    created_at: Mapped[object] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
