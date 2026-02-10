from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "DocuNexus"

    GOOGLE_API_KEY: str

    REDIS_URL: str

    CHROMA_CLOUD_API_KEY: str | None = None
    CHROMA_TENANT: str = "default_tenant"
    CHROMA_DATABASE: str = "default_database"

    USE_CLOUD_VECTOR_DB: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
