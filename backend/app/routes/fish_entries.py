from webbrowser import get
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from sqlalchemy.util import hybridmethod
from starlette.status import HTTP_200_OK

from app.db.database import get_db
from app.models.user import User
from app.models.fish_entry import FishEntry
from app.schemas.fish_entry import FishEntryCreate, FishEntryRead, FishEntryUpdate

router = APIRouter(prefix="/fish-entries", tags=["fish-entries"])

# Create a new fish entry
@router.post("/", response_model=FishEntryRead, status_code=status.HTTP_201_CREATED)
def create_fish_entry(fish_entry_in: FishEntryCreate, db: Session = Depends(get_db)):

    # check if user_id exists in User table before creating
    valid_user = db.get(User, fish_entry_in.user_id)


    if not valid_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Convert Pydtantic model to SQLAlchemy model
    fish_entry = FishEntry(**fish_entry_in.model_dump())
    
    # Persist to DB
    db.add(fish_entry)
    db.commit()
    db.refresh(fish_entry)

    return fish_entry

# Read a fish entry by ID
@router.get("/{fish_entry_id}", response_model=FishEntryRead)
def get_fish_entry(fish_entry_id: UUID, db: Session = Depends(get_db)):
    fish_entry  = db.get(FishEntry, fish_entry_id)
    if not fish_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fish entry not found")
    
    return fish_entry

# Update a fish entry via PATCH
@router.patch("/{fish_entry_id}", response_model=FishEntryRead)
def update_fish_entry(fish_entry_id: UUID, fish_entry_in: FishEntryUpdate, db: Session = Depends(get_db)):
    fish_entry = db.get(FishEntry, fish_entry_id)
    if not fish_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fish entry not found")
    
    # update fish entry fields
    for field, value in fish_entry_in.model_dump(exclude_unset=True).items():
        setattr(fish_entry, field, value)
    
    db.commit()
    db.refresh(fish_entry)

    return fish_entry

# Delete a fish entry
@router.delete("/{fish_entry_id}", status_code=status.HTTP_200_OK)
def delete_fish_entry(fish_entry_id: UUID, db: Session = Depends(get_db)):
    fish_entry = db.get(FishEntry, fish_entry_id)
    if not fish_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fish entry not found")
    
    db.delete(fish_entry)
    db.commit()

    return {"ok": True}


# Get all fish entries (for a user)
@router.get("/", response_model=List[FishEntryRead])
def get_fish_entries(db: Session = Depends(get_db), user_id: UUID | None = None):
    query = db.query(FishEntry)

    if user_id:
        query = query.filter(FishEntry.user_id == user_id)

    return query.all()