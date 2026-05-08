from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EsportInsight"
    API_V1_STR: str = "/api/v1"
    
    # OpenDota API
    OPENDOTA_API_URL: str = "https://api.opendota.com/api"
    
    # Kaggle / Data Paths
    DATASET_PATH: str = "../dataset"
    CACHE_DIR: str = "./cache"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
