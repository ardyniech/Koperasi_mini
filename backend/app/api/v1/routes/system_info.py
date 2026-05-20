# System information endpoint – provides disk usage, RAM usage and uptime.
# Works on Linux hosts by reading /proc/meminfo, /proc/uptime and statvfs('/')
# Returns values in GB and seconds for easy consumption by frontend or monitoring tools.

import os
from fastapi import APIRouter

router = APIRouter()

def _parse_meminfo() -> dict:
    """Parse /proc/meminfo into a dict of kilobytes values."""
    mem = {}
    with open('/proc/meminfo') as f:
        for line in f:
            if ':' not in line:
                continue
            key, val = line.split(':', 1)
            mem[key.strip()] = int(val.strip().split()[0])  # value in kB
    return mem

def _ram_stats() -> dict:
    mem = _parse_meminfo()
    total_kb = mem.get('MemTotal', 0)
    free_kb = mem.get('MemFree', 0) + mem.get('Buffers', 0) + mem.get('Cached', 0)
    used_kb = total_kb - free_kb
    return {
        "total_gb": round(total_kb / 1024 / 1024, 2),
        "used_gb": round(used_kb / 1024 / 1024, 2),
        "free_gb": round(free_kb / 1024 / 1024, 2),
    }

def _disk_stats() -> dict:
    st = os.statvfs('/')
    total = st.f_blocks * st.f_frsize
    free = st.f_bfree * st.f_frsize
    used = total - free
    return {
        "total_gb": round(total / 1024 / 1024 / 1024, 2),
        "used_gb": round(used / 1024 / 1024 / 1024, 2),
        "free_gb": round(free / 1024 / 1024 / 1024, 2),
    }

def _uptime_seconds() -> float:
    with open('/proc/uptime') as f:
        return float(f.read().split()[0])

@router.get('/system/info', tags=['system'])
def system_info():
    """Return combined system metrics: RAM, Disk, Uptime."""
    return {
        "ram": _ram_stats(),
        "disk": _disk_stats(),
        "uptime_seconds": round(_uptime_seconds(), 2),
    }
