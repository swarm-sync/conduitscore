from app.scanner.fix_generator import generate_fix
from app.types import CategoryScore, Issue


def build_category(name: str, max_score: int, score: int, title: str, description: str) -> CategoryScore:
    issue = Issue(
        id=f"{name.lower().replace(' ', '_')}_issue",
        category=name,
        severity="critical" if score <= max_score // 2 else "warning",
        title=title,
        description=description,
    )
    return CategoryScore(
        name=name,
        score=score,
        max_score=max_score,
        issues=[issue],
        fixes=[generate_fix(issue.id, title, description)],
    )
