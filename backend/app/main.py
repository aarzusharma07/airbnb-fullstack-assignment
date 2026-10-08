from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .config import CORS_ORIGINS
from .models import User, Listing, ListingImage, Booking, Review, Wishlist
from .routers import listings, bookings, reviews, wishlists, host
from .schemas.user import UserResponse

# Create SQLite relational tables
Base.metadata.create_all(bind=engine)

# Swagger OpenAPI Tag Metadata
tags_metadata = [
    {
        "name": "Listings Engine",
        "description": "Full-text search, multi-criteria filtering (location, date range, guests, price, amenities), and detailed property retrieval.",
    },
    {
        "name": "Booking & Overlap Validation",
        "description": "End-to-end reservation engine featuring algorithmic collision prevention: `start_date < existing.end_date AND end_date > existing.start_date`.",
    },
    {
        "name": "Host Management & CRUD",
        "description": "Host suite for property creation, updates, removals, and performance analytics (gross revenue, reservation volume, average ratings).",
    },
    {
        "name": "Reviews & Ratings",
        "description": "Aggregated 6-metric review system (cleanliness, accuracy, communication, location, check-in, value) and guest feedback.",
    },
    {
        "name": "Wishlists & Saved Stays",
        "description": "Optimistic wishlist toggling and user saved collections.",
    },
    {
        "name": "System & Demo Profiles",
        "description": "Health checks, demo user switching, and environment status.",
    },
]

app = FastAPI(
    title="Airbnb Clone REST API — By Aarzu",
    description="""
## 🏨 Airbnb Marketplace & Booking Engine API

A production-grade, asynchronous REST API powering the **Airbnb Clone** web application.

### 🛠️ Architecture & Tech Stack
- **Framework**: Python 3.10+ with FastAPI
- **ORM & Validation**: SQLAlchemy 2.0 + Pydantic v2
- **Database**: SQLite with relational foreign keys, indexes, and cascades
- **Collision Detection**: Algorithmic date-interval overlap query prevention
- **Developer**: **Aarzu** (Fullstack SDE Assignment)

---
*Built for hiring assignment evaluation. All endpoints support cross-origin requests.*
    """,
    version="2.4.0-production",
    contact={
        "name": "Aarzu (Fullstack SDE)",
        "email": "aarzu@example.com",
    },
    openapi_tags=tags_metadata,
    swagger_ui_parameters={
        "docExpansion": "list",
        "defaultModelsExpandDepth": 2,
        "filter": True,
        "syntaxHighlight.theme": "monokai"
    }
)

@app.on_event("startup")
def on_startup():
    db = next(get_db())
    try:
        from .seed_data import seed_database
        seed_database(db)
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach Modular Routers
app.include_router(listings.router, tags=["Listings Engine"])
app.include_router(bookings.router, tags=["Booking & Overlap Validation"])
app.include_router(reviews.router, tags=["Reviews & Ratings"])
app.include_router(wishlists.router, tags=["Wishlists & Saved Stays"])
app.include_router(host.router, tags=["Host Management & CRUD"])

@app.get("/", tags=["System & Demo Profiles"])
def root():
    return {
        "platform": "Airbnb Clone API",
        "developer": "Aarzu",
        "version": "2.4.0-production",
        "status": "online",
        "documentation": "/docs",
        "openapi_spec": "/openapi.json"
    }

@app.get("/api/health", tags=["System & Demo Profiles"])
def health_check():
    return {
        "status": "healthy",
        "environment": "local-development",
        "database": "SQLite (airbnb.db)"
    }

@app.get("/api/users", response_model=list[UserResponse], tags=["System & Demo Profiles"])
def get_demo_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
