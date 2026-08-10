import os
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    create_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker

DB_URL = os.getenv("DATABASE_URL", "sqlite:///./lease_audit.db")
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class LeaseAuditResult(Base):
    __tablename__ = "lease_audit_results"

    id = Column(Integer, primary_key=True, index=True)
    source_file_name = Column(String, nullable=False)
    unit_entitlement_percentage = Column(Float, nullable=False)
    statutory_vulnerabilities = Column(JSON, nullable=False, default=list)
    voting_threshold_met = Column(Boolean, nullable=False)
    compliance_notes = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
