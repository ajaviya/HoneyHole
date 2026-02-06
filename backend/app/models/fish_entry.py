import uuid
from sqlalchemy import Column, String, DateTime, Float, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base
from sqlalchemy.orm import relationship


class FishEntry(Base):
    __tablename__ = "fish_entries"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    species = Column(
        String,
        nullable=False,
        index=True,
    )

    location = Column(
        String,
        nullable=False,
        index=True,
    )

    length_in = Column(
        Float,
        nullable=False,
    )

    weight_lb = Column(
        Float,
        nullable=True,
    )

    bait = Column(
        String,
        nullable=True,
    )

    rig = Column(
        String,
        nullable=True,
    )

    caught_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    notes = Column(
        String,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="fish_entries",
    )