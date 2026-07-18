from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ticket import Ticket


async def create_ticket(db: AsyncSession, user_id: int):
    ticket = Ticket(user_id=user_id)
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return ticket


async def pick_ticket(db: AsyncSession, resolver_id: int, ticket_id: int):
    result = await db.execute(
        update(Ticket)
        .where(Ticket.id == ticket_id, Ticket.status == "open")
        .values(status="assigned", resolver_id=resolver_id)
    )
    await db.commit()
    return result.rowcount
