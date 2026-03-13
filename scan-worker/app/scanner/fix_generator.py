from app.types import Fix


def generate_fix(issue_id: str, title: str, description: str) -> Fix:
    return Fix(
        issue_id=issue_id,
        title=f"Fix {title.lower()}",
        description=description,
        code=f"# {title}\n# Replace this stub with the production fix.",
        language="md",
    )
