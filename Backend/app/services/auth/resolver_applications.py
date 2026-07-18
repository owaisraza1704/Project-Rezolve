from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.auth.models.profile import Profile
from app.services.auth.models.resolver_application import ResolverApplication
from app.services.auth.schemas.resolver_application import ResolverApplicationReview
from app.services.auth.schemas.resolver_application import ResolverApplicationSubmission


async def create_resolver_application(
    db: AsyncSession,
    profile_id: int,
    payload: ResolverApplicationSubmission,
) -> ResolverApplication:
    application = ResolverApplication(
        profile_id=profile_id,
        motivation=payload.motivation,
        experience_summary=payload.experience_summary,
        skills=payload.skills,
        availability=payload.availability,
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


async def get_resolver_applications_for_profile(
    db: AsyncSession,
    profile_id: int,
) -> list[ResolverApplication]:
    result = await db.execute(
        select(ResolverApplication)
        .where(ResolverApplication.profile_id == profile_id)
        .order_by(ResolverApplication.id.desc())
    )
    return list(result.scalars().all())


async def get_all_resolver_applications(
    db: AsyncSession,
) -> list[ResolverApplication]:
    result = await db.execute(
        select(ResolverApplication).order_by(ResolverApplication.id.desc())
    )
    return list(result.scalars().all())


async def get_resolver_application_by_id(
    db: AsyncSession,
    application_id: int,
) -> ResolverApplication | None:
    result = await db.execute(
        select(ResolverApplication).where(ResolverApplication.id == application_id)
    )
    return result.scalar_one_or_none()


async def approve_resolver_application(
    db: AsyncSession,
    application: ResolverApplication,
    reviewer_profile_id: int,
    payload: ResolverApplicationReview,
) -> ResolverApplication:
    application.status = "approved"
    application.review_notes = payload.review_notes
    application.reviewed_by = reviewer_profile_id

    result = await db.execute(
        select(Profile).where(Profile.id == application.profile_id)
    )
    profile = result.scalar_one()
    profile.role = "resolver"

    await db.commit()
    await db.refresh(application)
    return application


async def reject_resolver_application(
    db: AsyncSession,
    application: ResolverApplication,
    reviewer_profile_id: int,
    payload: ResolverApplicationReview,
) -> ResolverApplication:
    application.status = "rejected"
    application.review_notes = payload.review_notes
    application.reviewed_by = reviewer_profile_id

    await db.commit()
    await db.refresh(application)
    return application
