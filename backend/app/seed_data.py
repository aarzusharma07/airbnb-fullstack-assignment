import json
import os
from sqlalchemy.orm import Session
from .models import User, Listing, ListingImage, Booking, Review, Wishlist
from datetime import date, timedelta

def seed_database(db: Session):
    if db.query(User).count() > 0:
        return

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    users_file = os.path.join(base_dir, "seed_users.json")
    listings1_file = os.path.join(base_dir, "seed_listings_1.json")
    listings2_file = os.path.join(base_dir, "seed_listings_2.json")

    # 1. Seed Users (Aarzu is the primary demo account)
    created_users = []
    if os.path.exists(users_file):
        with open(users_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            for u in data.get("users", []):
                user = User(
                    name=u["name"],
                    email=u["email"],
                    avatar_url=u.get("avatar_url"),
                    is_host=u.get("is_host", False),
                    is_superhost=u.get("is_superhost", False),
                    joined_date=u.get("joined_date", "Joined 2023")
                )
                db.add(user)
                created_users.append(user)
        db.commit()

    # 2. Seed Listings
    listings_data = []
    for lfile in [listings1_file, listings2_file]:
        if os.path.exists(lfile):
            with open(lfile, "r", encoding="utf-8") as f:
                listings_data.extend(json.load(f))

    for idx, l in enumerate(listings_data):
        host_idx = l.get("host_idx", (idx % 4) + 2)
        listing = Listing(
            host_id=host_idx,
            title=l["title"],
            description=l["description"],
            category=l["category"],
            property_type=l["property_type"],
            price_per_night=l["price_per_night"],
            cleaning_fee=l.get("cleaning_fee", 80),
            service_fee=l.get("service_fee", 45),
            city=l["city"],
            country=l["country"],
            location=l["location"],
            latitude=l["latitude"],
            longitude=l["longitude"],
            max_guests=l["max_guests"],
            bedrooms=l.get("bedrooms", 2),
            beds=l.get("beds", 2),
            baths=l.get("baths", 2.0),
            amenities=json.dumps(l.get("amenities", ["Wifi", "Kitchen", "Air conditioning"])),
            rating=l.get("rating", 4.9),
            reviews_count=l.get("reviews_count", 15),
        )
        db.add(listing)
        db.flush()

        # Add images
        for order, img_url in enumerate(l.get("images", [])):
            img = ListingImage(
                listing_id=listing.id,
                url=img_url,
                is_cover=(order == 0),
                display_order=order
            )
            db.add(img)

        # Add sample reviews
        if idx < 6:
            r1 = Review(
                listing_id=listing.id,
                user_id=1,
                rating=5.0,
                cleanliness=5.0,
                accuracy=5.0,
                communication=5.0,
                location_rating=5.0,
                value_rating=4.9,
                comment="Absolutely extraordinary place! The views were spectacular, exactly as shown in photos. Impeccably clean with top-tier amenities."
            )
            db.add(r1)

    # 3. Add sample bookings for user 1 (Aarzu)
    today = date.today()
    b1 = Booking(
        listing_id=1,
        user_id=1,
        start_date=today + timedelta(days=10),
        end_date=today + timedelta(days=15),
        guests_count=2,
        nightly_price=790,
        total_price=790 * 5 + 140 + 75,
        status="confirmed"
    )
    b2 = Booking(
        listing_id=2,
        user_id=1,
        start_date=today + timedelta(days=20),
        end_date=today + timedelta(days=24),
        guests_count=2,
        nightly_price=440,
        total_price=440 * 4 + 90 + 45,
        status="confirmed"
    )
    db.add(b1)
    db.add(b2)

    # 4. Add sample wishlists
    w1 = Wishlist(user_id=1, listing_id=1)
    w2 = Wishlist(user_id=1, listing_id=3)
    db.add(w1)
    db.add(w2)

    db.commit()
    print("Database successfully initialized and seeded with Aarzu demo stays!")
