def build_scan_update(scan_id: str, result: dict) -> dict:
    return {"scan_id": scan_id, "payload": result}
