from fastapi import FastAPI
from app.routes.tickets import router as tickets_router
from app.services.auth import admin_router as auth_admin_router
from app.services.auth import router as auth_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(auth_admin_router)
app.include_router(tickets_router)
