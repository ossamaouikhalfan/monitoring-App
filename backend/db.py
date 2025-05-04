from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from datetime import datetime
import mysql.connector

# Load environment variables
load_dotenv()

# Database configuration
DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'um6pmonitoringum6pmonitoring')
DB_NAME = os.getenv('DB_NAME', 'um6p_monitoring')

def create_database():
    """Create the database if it doesn't exist."""
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        
        cursor.close()
        conn.close()
        print(f"Database '{DB_NAME}' created successfully")
    except Exception as e:
        print(f"Error creating database: {e}")
        raise

# Create database URL
DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}"

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for declarative models
Base = declarative_base()

# Define User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    """Initialize the database, creating all tables if they don't exist."""
    try:
        # First create the database
        create_database()
        
        # Then create all tables
        Base.metadata.create_all(bind=engine)
        print("Database tables initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()