"""
Migration: Add report_type column to reports table
"""
from sqlalchemy import text
from app.database import engine


def migrate():
    """Add report_type column if it doesn't exist."""
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text("""
            SELECT COUNT(*) as cnt
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'reports'
            AND COLUMN_NAME = 'report_type'
        """))
        row = result.fetchone()
        
        if row and row[0] == 0:
            # Column doesn't exist, add it
            conn.execute(text("""
                ALTER TABLE reports 
                ADD COLUMN report_type VARCHAR(50) NOT NULL DEFAULT 'prescription'
                AFTER user_id
            """))
            conn.commit()
            print("Added report_type column to reports table")
        else:
            print("report_type column already exists")


if __name__ == "__main__":
    migrate()
