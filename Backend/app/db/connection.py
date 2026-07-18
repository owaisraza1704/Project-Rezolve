import os

from dotenv import load_dotenv
from psycopg import connect
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import async_sessionmaker

load_dotenv()

async_engine = create_async_engine(os.environ["DATABASE_URL"])
AsyncSessionLocal = async_sessionmaker(async_engine, expire_on_commit=False)


def get_connection():
    return connect(os.environ["DATABASE_URL"])
