"""Canonical column order for Google Sheet — matches outreach mail-merge expectations."""

SHEET_COLUMNS: list[str] = [
    "receiver_email",
    "first_name",
    "company_name",
    "domain",
    "ai_visibility_score",
    "top_issue",
    "issue_description",
    "recommended_fix",
    "code_snippet",
    "score_category",
    "sequence_type",
    "email_step",
    "subject",
    "body_html",
    "body_text",
    "sender_name",
    "sender_email",
    "rescan_link",
    "verify_link",
    "benchmark_note",
    "status",
    "sent_timestamp",
    "unsubscribe_token",
    "scrape_source",
    "notes",
    # Suggested extras
    "industry_vertical",
    "icp_tag",
    "estimated_ai_traffic_impact",
    "last_rescan_score",
    "dynamic_fields_json",
    "rendered_email_preview",
    "send_priority",
    "batch_group",
    "template_version",
]


def row_dict_to_list(row: dict[str, str]) -> list[str]:
    return [str(row.get(col, "") or "") for col in SHEET_COLUMNS]
