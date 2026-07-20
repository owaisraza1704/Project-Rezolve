import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.auth import admin_router as auth_admin_router
from app.services.auth import router as auth_router

app = FastAPI()

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOW_ORIGINS",
        "http://localhost:8443,http://127.0.0.1:8443",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(auth_admin_router)
