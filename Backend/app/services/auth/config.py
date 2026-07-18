import os

from dotenv import load_dotenv

load_dotenv()


class AuthConfig:
    provider = os.getenv("AUTH_PROVIDER", "supabase")
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
