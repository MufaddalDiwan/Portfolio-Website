#!/usr/bin/env python3
"""
Manual migration to add avatar_image and profile_image fields to site_meta table
"""

import os
import sqlite3


def run_migration():
    db_path = os.path.join(os.path.dirname(__file__), "instance", "portfolio.db")

    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return False

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if columns already exist
        cursor.execute("PRAGMA table_info(site_meta)")
        columns = [column[1] for column in cursor.fetchall()]

        if "avatar_image" not in columns:
            cursor.execute("ALTER TABLE site_meta ADD COLUMN avatar_image VARCHAR(500)")
            print("Added avatar_image column")
        else:
            print("avatar_image column already exists")

        if "profile_image" not in columns:
            cursor.execute("ALTER TABLE site_meta ADD COLUMN profile_image VARCHAR(500)")
            print("Added profile_image column")
        else:
            print("profile_image column already exists")

        # Update existing record with default image values
        cursor.execute(
            """
            UPDATE site_meta 
            SET avatar_image = 'avatar.webp', profile_image = 'profile.webp'
            WHERE avatar_image IS NULL OR profile_image IS NULL
        """
        )

        conn.commit()
        print("Migration completed successfully")
        return True

    except Exception as e:
        print(f"Migration failed: {e}")
        return False
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    run_migration()
