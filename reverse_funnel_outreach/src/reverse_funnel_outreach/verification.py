from __future__ import annotations

from dataclasses import dataclass
import re

import dns.resolver

from reverse_funnel_outreach.config import get_bool


@dataclass
class VerificationResult:
    status: str
    detail: str = ""


@dataclass
class EmailVerification:
    syntax_ok: bool
    mx_status: str
    catch_all_status: str
    verification_status: str
    deliverability_confidence: int
    # invalid | unknown | risky | valid — cohort for segmentation
    delivery_state: str = "unknown"


def syntax_check(email: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}", email or ""))


def mx_check(domain: str) -> VerificationResult:
    try:
        answers = dns.resolver.resolve(domain, "MX")
        if answers:
            return VerificationResult(status="mx_valid")
        return VerificationResult(status="mx_missing")
    except Exception as exc:
        return VerificationResult(status="mx_error", detail=str(exc))


def detect_catch_all(domain: str) -> VerificationResult:
    """
    Catch-all detection. When ENABLE_SMTP_CATCH_ALL_PROBE is false (default), inconclusive.

    When true, an SMTP probe should run here; until implemented, status stays unknown with
    a detail hint so logs/tests can tell it apart from the disabled path.
    """
    if not get_bool("ENABLE_SMTP_CATCH_ALL_PROBE", False):
        return VerificationResult(status="unknown")
    return VerificationResult(status="unknown", detail="smtp_catch_all_probe_not_implemented")


def verify_candidate(email: str, root_domain: str) -> EmailVerification:
    syntax_ok = syntax_check(email)
    mail_dom = email.split("@", 1)[1] if "@" in email else root_domain
    mx = mx_check(mail_dom)
    catch_all = detect_catch_all(root_domain)

    score = 0
    if syntax_ok:
        score += 35
    if mx.status == "mx_valid":
        score += 45
    if catch_all.status == "unknown":
        score += 10

    if not syntax_ok or mx.status == "mx_missing":
        delivery_state = "invalid"
    elif mx.status == "mx_error":
        delivery_state = "unknown"
    elif catch_all.status == "accept_all":
        delivery_state = "risky"
    elif syntax_ok and mx.status == "mx_valid":
        delivery_state = "valid"
    else:
        delivery_state = "unknown"

    if delivery_state == "invalid":
        verification_status = "invalid"
    elif delivery_state == "risky":
        verification_status = "risky"
    elif delivery_state == "valid":
        verification_status = "verified"
    else:
        verification_status = "risky"

    return EmailVerification(
        syntax_ok=syntax_ok,
        mx_status=mx.status,
        catch_all_status=catch_all.status,
        verification_status=verification_status,
        deliverability_confidence=min(100, max(0, score)),
        delivery_state=delivery_state,
    )
