from datetime import datetime

from pydantic import BaseModel


class ResolverApplicationSubmission(BaseModel):
    motivation: str
    experience_summary: str | None = None
    skills: str | None = None
    availability: str | None = None


class PublicResolverOnboardingSubmission(ResolverApplicationSubmission):
    full_name: str
    email: str
    password: str


class ResolverApplicationResponse(BaseModel):
    id: int
    profile_id: int
    status: str
    motivation: str
    experience_summary: str | None = None
    skills: str | None = None
    availability: str | None = None
    review_notes: str | None = None
    reviewed_by: int | None = None
    created_at: datetime


class ResolverApplicationReview(BaseModel):
    review_notes: str | None = None
