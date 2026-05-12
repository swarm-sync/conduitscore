from reverse_funnel_outreach.verification import (
    VerificationResult,
    detect_catch_all,
    syntax_check,
    verify_candidate,
)


def test_syntax_check():
    assert syntax_check("team@acme.com")
    assert not syntax_check("bad@@acme.com")


def test_verify_candidate_returns_bounds():
    v = verify_candidate("team@acme.com", "acme.com")
    assert 0 <= v.deliverability_confidence <= 100
    assert v.verification_status in ("verified", "risky", "invalid")
    assert getattr(v, "delivery_state", "") in ("invalid", "unknown", "risky", "valid")


def test_verify_candidate_risky_when_catch_all_accept_all(monkeypatch):
    """Branch is reachable when catch-all probe reports accept-all (e.g. future SMTP)."""
    from reverse_funnel_outreach import verification as vmod

    monkeypatch.setattr(vmod, "mx_check", lambda _d: VerificationResult(status="mx_valid"))
    monkeypatch.setattr(
        vmod, "detect_catch_all", lambda _d: VerificationResult(status="accept_all")
    )
    v = verify_candidate("team@acme.com", "acme.com")
    assert v.delivery_state == "risky"
    assert v.verification_status == "risky"
    assert v.catch_all_status == "accept_all"


def test_detect_catch_all_respects_env_disabled(monkeypatch):
    monkeypatch.delenv("ENABLE_SMTP_CATCH_ALL_PROBE", raising=False)
    r = detect_catch_all("example.com")
    assert r.status == "unknown"


def test_detect_catch_all_when_enabled_still_unknown_until_probe(monkeypatch):
    monkeypatch.setenv("ENABLE_SMTP_CATCH_ALL_PROBE", "true")
    r = detect_catch_all("example.com")
    assert r.status == "unknown"
    assert "not_implemented" in (r.detail or "")
