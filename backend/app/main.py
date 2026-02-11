from fastapi import FastAPI
from app.routes.users import router as users_router
from app.routes.fish_entries import router as fish_entries_router

app = FastAPI()

app.include_router(users_router)
app.include_router(fish_entries_router)
