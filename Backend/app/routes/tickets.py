from fastapi import APIRouter
from pydantic import BaseModel

from app.db.tickets import create_ticket as create_ticket_record
from app.db.tickets import pick_ticket as pick_ticket_record

router = APIRouter(prefix="/api/v1/tickets")


class CreateTicketRequest(BaseModel):
    user_id: int


class PickTicketRequest(BaseModel):
    resolver_id: int


@router.post("", status_code=201)
async def create_ticket(payload: CreateTicketRequest):
    await create_ticket_record(payload.user_id)
    return {"status": "open"}


@router.put("/{ticket_id}/pick")
def pick_ticket(ticket_id: int, payload: PickTicketRequest):
    pick_ticket_record(payload.resolver_id, ticket_id)
    return {"status": "assigned"}
