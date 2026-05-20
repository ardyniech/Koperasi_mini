from fastapi import APIRouter
from datetime import datetime
from app.core.logger import logger

router = APIRouter()

# Simple in-memory message store
messages = []

@router.post("/bridge/send")
def send_message(payload: dict):
    """Send message from source (vaio/termux)"""
    logger.info(f"[Bridge] Send: from={payload.get('source', 'unknown')}")
    try:
        messages.append({
            "from": payload.get("source", "unknown"),
            "msg": payload.get("message", ""),
            "ts": str(datetime.now())
        })
        logger.info(f"[Bridge] Stored: total={len(messages)}")
        return {"ok": True, "stored": len(messages)}
    except Exception as e:
        logger.error(f"[Bridge] Send failed: {str(e)}")
        raise

@router.get("/bridge/receive")
def receive_messages(since: int = 0):
    """Receive messages since index"""
    logger.info(f"[Bridge] Receive: since={since}")
    try:
        return {"messages": messages[since:], "total": len(messages)}
    except Exception as e:
        logger.error(f"[Bridge] Receive failed: {str(e)}")
        raise
