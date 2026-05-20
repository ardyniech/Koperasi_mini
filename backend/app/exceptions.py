"""
Global Exception Handlers for FastAPI.
Returns structured JSON error responses (PRD Section: Struktur Response API).
"""
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import traceback
from app.core.logger import logger


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Handle HTTP exceptions (404, 403, etc.)"""
    logger.error(f"[GlobalException] HTTP {exc.status_code}: {exc.detail} | Path: {request.url.path}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": f"HTTP_{exc.status_code}",
            "message": str(exc.detail)
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle request validation errors (Pydantic)"""
    logger.error(f"[GlobalException] Validation Error: {exc.errors()} | Path: {request.url.path}")
    
    # Extract simple error messages
    error_messages = []
    for error in exc.errors():
        loc = ' -> '.join(str(x) for x in error.get('loc', []))
        msg = error.get('msg', str(error.get('exc', '')))
        error_messages.append(f"{loc}: {msg}")
    
    return JSONResponse(
        status_code=422,
        content={
            "status": "error",
            "code": "VALIDATION_ERROR",
            "message": "Invalid request data",
            "details": error_messages  # Now it's a list of strings, JSON serializable
        }
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all unhandled exceptions"""
    logger.error(f"[GlobalException] Unhandled Error: {str(exc)} | Path: {request.url.path}")
    logger.error(f"[GlobalException] Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "code": "INTERNAL_ERROR",
            "message": "An internal server error occurred"
        }
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers to the FastAPI app"""
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
