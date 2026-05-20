"""
Logger configuration using Loguru.
Provides structured logging with rotation for easy debugging.
JSON logs are also written for structured log aggregation.
"""

from loguru import logger
import sys
import os

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

# Remove default handler
logger.remove()

# Stdout handler (development)
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="INFO",
)

# File handler (plain text)
logger.add(
    "logs/backend.log",
    rotation="500 MB",
    retention="30 days",
    compression="zip",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{line} - {message}",
    level="DEBUG",
    backtrace=True,
    diagnose=True,
)

# JSON file handler (structured)
logger.add(
    "logs/backend.json",
    rotation="500 MB",
    retention="30 days",
    compression="zip",
    serialize=True,
    level="DEBUG",
    backtrace=True,
    diagnose=True,
)

# Export logger instance
__all__ = ["logger"]
