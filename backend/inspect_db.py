import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "airbnb.db")

print("==================================================")
print(f"DATABASE FILE: {os.path.abspath(db_path)}")
print(f"FILE SIZE: {os.path.getsize(db_path) / 1024:.2f} KB" if os.path.exists(db_path) else "Database not found")
print("==================================================\n")

if not os.path.exists(db_path):
    print("Database not found! Start the backend server to auto-generate it.")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Show all Tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]
print(f"TABLES IN DATABASE ({len(tables)}):")
for t in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {t}")
    count = cursor.fetchone()[0]
    print(f"  * {t:<20} -> {count} records")

print("\n" + "=" * 50)
print("SAMPLE USERS:")
print("=" * 50)
cursor.execute("SELECT id, name, email, is_host, is_superhost FROM users LIMIT 3")
for row in cursor.fetchall():
    role = "Superhost" if row[4] else ("Host" if row[3] else "Guest")
    print(f"ID {row[0]}: {row[1]} ({row[2]}) | Role: {role}")

print("\n" + "=" * 50)
print("SAMPLE LISTINGS:")
print("=" * 50)
cursor.execute("SELECT id, title, city, country, price_per_night, rating FROM listings LIMIT 4")
for row in cursor.fetchall():
    print(f"#{row[0]} - {row[1]}")
    print(f"     Location: {row[2]}, {row[3]} | Price: ${row[4]}/night | Rating: {row[5]}")

print("\n" + "=" * 50)
print("CONFIRMED BOOKINGS:")
print("=" * 50)
cursor.execute("SELECT b.id, u.name, l.title, b.start_date, b.end_date, b.total_price FROM bookings b JOIN users u ON b.user_id=u.id JOIN listings l ON b.listing_id=l.id")
bookings = cursor.fetchall()
if bookings:
    for b in bookings:
        print(f"Booking #{b[0]}: Guest '{b[1]}' -> '{b[2][:30]}...'")
        print(f"   Dates: {b[3]} to {b[4]} | Total: ${b[5]}")
else:
    print("No bookings yet.")

conn.close()
print("\n==================================================")
print("Database connection and schema verified successfully!")
print("==================================================")
