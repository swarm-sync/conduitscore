from typing import Optional

from pydantic import BaseModel


class Issue(BaseModel):
    id: str
    category: str
    severity: str
    title: str
    description: str


class Fix(BaseModel):
    issue_id: str
    title: str
    description: str
    code: str
    language: str


class CategoryScore(BaseModel):
    name: str
    score: int
    max_score: int
    issues: list[Issue]
    fixes: list[Fix]


class ConduitScanData(BaseModel):
    url: str
    nav: dict
    main_content: dict
    js_delta: dict
    accessibility: dict
    structured_data: dict
    robots: dict
    network: dict
    console: dict


class ScanResult(BaseModel):
    url: str
    overall_score: int
    categories: list[CategoryScore]
    issues: list[Issue]
    fixes: list[Fix]
    scanned_at: str
    metadata: dict
    proof: Optional[dict] = None
