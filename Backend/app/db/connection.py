import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import async_sessionmaker

load_dotenv(override=True)

def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("Database configuration is missing. Set DATABASE_URL.")

    return database_url.strip()

async_engine = create_async_engine(get_database_url())
AsyncSessionLocal = async_sessionmaker(async_engine, expire_on_commit=False)
