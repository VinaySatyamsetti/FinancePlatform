from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Finance Platform API"
    env: str = "dev"
    api_v1_prefix: str = "/api/v1"
    secret_key: str = "change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./finance.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    kafka_enabled: bool = True
    kafka_bootstrap_servers: str = "kafka:9092"
    kafka_topic_expense_created: str = "expense.created"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
