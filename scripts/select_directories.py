#!/usr/bin/env python3
"""
select_directories.py — ConduitScore
Reads directories.csv and selects the best automatable directories for ConduitScore.

Selection criteria:
- submission_method = web_form
- has_captcha = false
- requires_login = false
- active = true
- requires_payment = false
- Category relevant to SaaS/AI/tech/business

Output: scripts/selected_directories.json (split into 6 batches for 6 workers)
"""

import csv
import json
import re
import sys
from pathlib import Path

CSV_PATH = Path(r"C:\Users\Administrator\.claude\skills\imperium\directories.csv")
OUTPUT_PATH = Path(r"C:\Users\Administrator\Desktop\ConduitScore\scripts\selected_directories.json")

# Categories we want to target for ConduitScore (SaaS/AI visibility tool)
TARGET_CATEGORIES = {
    "saas", "tech", "tech_startups", "startup", "b2b", "business_general",
    "ai_tools", "ai", "tools", "design", "blog", "ecommerce", "marketing",
    "seo", "software", "productivity", "General", "consulting", "review",
    "social_media", "content_media", "pr", "local_business"
}

# Skip these even if they match categories (require accounts, editorial review, or are community platforms)
SKIP_NAMES = {
    "Product Hunt", "Indie Hackers", "Hacker News", "Reddit", "BetaList",
    "G2", "Capterra", "Trustpilot", "AppSumo", "GitHub", "GitLab",
    "Dev.to", "Hashnode", "Twitter", "LinkedIn", "Facebook", "Instagram",
    "Babel Slack", "Loqol Startup Community", "Google Business Profile",
    "Alibaba", "IndiaMART", "LiveJournal", "Designer News", "Slant",
    "TrustRadius", "Sitejabber", "Software Advice", "GetApp", "FinancesOnline",
    "Crozdesk", "Saasworthy", "Pitch Ground",
}


def parse_json_field(value):
    """Parse a JSON string field safely."""
    if not value or value in ("{}", "[]", ""):
        return {}
    try:
        return json.loads(value)
    except Exception:
        return {}


def parse_list_field(value):
    """Parse a JSON array string into a Python list."""
    if not value or value in ("[]", ""):
        return []
    try:
        return json.loads(value)
    except Exception:
        return []


def load_directories():
    """Load and filter directories from CSV."""
    selected = []

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)

        # Map column names to indices
        col = {name.strip(): i for i, name in enumerate(header)}

        for row in reader:
            if len(row) < len(col):
                continue

            def get(field, default=""):
                idx = col.get(field)
                return row[idx].strip() if idx is not None and idx < len(row) else default

            # --- Hard filters ---
            if get("active") != "true":
                continue
            if get("submission_method") != "web_form":
                continue
            if get("requires_login") == "true":
                continue
            if get("requires_payment") == "true":
                continue
            if get("status") != "active":
                continue

            # Check captcha
            has_captcha = get("has_captcha")
            captcha_type = get("captcha_type")
            if has_captcha == "true":
                continue
            if captcha_type and captcha_type not in ("", "null", "none"):
                # Double check via features JSON
                features_raw = get("features")
                if features_raw:
                    features = parse_json_field(features_raw)
                    if isinstance(features, dict):
                        ct = features.get("captcha_type")
                        if ct and ct not in (None, "null", "none", ""):
                            continue

            # --- Category filter ---
            category = get("category")
            name = get("name")

            # Also check niche_tags for AI/tech keywords
            niche_tags_raw = get("niche_tags")
            niche_tags = parse_list_field(niche_tags_raw)

            ai_tech_tags = {"ai", "tech", "saas", "startup", "business", "software",
                           "marketing", "seo", "tools", "automation", "productivity"}
            has_relevant_tag = bool(set(t.lower() for t in niche_tags) & ai_tech_tags)

            if category not in TARGET_CATEGORIES and not has_relevant_tag:
                continue

            # Skip manually excluded names
            if name in SKIP_NAMES:
                continue

            # Skip known non-relevant categories regardless of tags
            skip_cats = {"restaurant", "healthcare", "automotive", "wellness", "arts",
                        "senior_care", "wedding", "childcare", "real_estate", "media",
                        "legal", "fitness", "beauty", "travel", "food", "pets",
                        "education_k12", "nonprofit", "government", "finance_personal"}
            if category in skip_cats:
                continue

            # --- Collect entry ---
            required_fields = parse_list_field(get("required_fields"))
            optional_fields = parse_list_field(get("optional_fields"))

            # Scoring: prefer Easy + high DA + tech-relevant
            da = int(get("domain_authority") or 0)
            difficulty = get("difficulty")
            diff_score = {"Easy": 10, "Medium": 5, "Hard": 0}.get(difficulty, 5)
            priority = int(get("priority_score") or 50)

            # Boost AI/SaaS categories
            cat_boost = 20 if category in {"saas", "ai_tools", "tech_startups", "startup"} else 0
            tag_boost = 10 if has_relevant_tag else 0

            score = (da / 100 * 30) + diff_score + (priority / 100 * 20) + cat_boost + tag_boost

            selected.append({
                "id": get("id"),
                "name": name,
                "website": get("website"),
                "submission_url": get("submission_url"),
                "category": category,
                "domain_authority": da,
                "difficulty": difficulty,
                "niche_tags": niche_tags,
                "required_fields": required_fields,
                "optional_fields": optional_fields,
                "score": round(score, 2),
            })

    # Sort by score descending
    selected.sort(key=lambda d: d["score"], reverse=True)

    # Deduplicate by submission_url
    seen_urls = set()
    deduped = []
    for d in selected:
        url = d["submission_url"]
        if url and url not in seen_urls:
            seen_urls.add(url)
            deduped.append(d)

    return deduped


def split_into_batches(directories, num_batches=6):
    """Split directories evenly across N worker batches."""
    batches = {i: [] for i in range(1, num_batches + 1)}
    for i, d in enumerate(directories):
        batch_num = (i % num_batches) + 1
        batches[batch_num].append(d)
    return batches


def main():
    print("=" * 60)
    print("ConduitScore — Directory Selector")
    print("=" * 60)

    dirs = load_directories()
    print(f"\nTotal qualifying directories: {len(dirs)}")

    if not dirs:
        print("ERROR: No directories found. Check CSV path and filters.")
        sys.exit(1)

    batches = split_into_batches(dirs, num_batches=6)

    output = {
        "total": len(dirs),
        "num_batches": 6,
        "batches": batches
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print(f"\nBatch sizes:")
    for b, items in batches.items():
        print(f"  Batch {b}: {len(items)} directories")

    print(f"\nOutput saved: {OUTPUT_PATH}")
    print(f"\nTop 10 by score:")
    for d in dirs[:10]:
        print(f"  [{d['score']:5.1f}] {d['name']} ({d['category']}) — {d['submission_url']}")


if __name__ == "__main__":
    main()
