from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
import logging
from dotenv import load_dotenv
load_dotenv()


logger = logging.getLogger(__name__)

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# Function to create a SQLAlchemy engine for RAG/vector DB operations
def get_engine():
    """Creates and returns a SQLAlchemy engine, testing the connection."""
    engine = create_engine(
        url = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
        pool_pre_ping=True,
    )
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            logger.info("Connected to the database")
    except Exception as e:
        logger.error(f"Error connecting to the database: {e}")
        raise
    return engine

# Global engine for RAG/vector store usage
engine = get_engine()

# SessionLocal for simple CRUD endpoints
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Dependency for FastAPI endpoints
def get_db():
    """Yields a SQLAlchemy session, closes it automatically."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()