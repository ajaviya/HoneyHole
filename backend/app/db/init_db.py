from app.db.database import engine
from app.models.base import Base

# Import models so SQLAlchemy registers them
from app.models.user import User
from app.models.fish_entry import FishEntry


def init_db():
    Base.metadata.create_all(bind=engine)
