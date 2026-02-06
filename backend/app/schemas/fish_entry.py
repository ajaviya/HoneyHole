from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class FishEntryBase(BaseModel):
    species: str
    location: str
    length_in: float
    weight_lb: float | None = None
    bait: str | None = None
    rig: str | None = None
    caught_at: datetime | None = None
    notes: str | None = None

class FishEntryBaseMinimal(BaseModel):
    species: str
    location: str
    length_in: float
    weight_lb: float | None = None


class FishEntryCreate(FishEntryBase):
    user_id: UUID

class FishEntryUpdate(BaseModel):
    species: str | None = None
    location: str | None = None
    length_in: float | None = None
    weight_lb: float | None = None
    bait: str | None = None
    rig: str | None = None
    caught_at: datetime | None = None
    notes: str | None = None

class FishEntryRead(FishEntryBaseMinimal):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True