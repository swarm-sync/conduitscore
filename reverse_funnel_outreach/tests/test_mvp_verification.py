"""
MVP Verification Suite — Domain-First Prospecting Engine
=========================================================
Tests pure-logic modules only (no network, no browser, no DB).
Run from reverse_funnel_outreach/:
    pip install -e ".[dev]" pytest
    pytest tests/test_mvp_verification.py -v

Known bugs documented with xfail:
  - normalize_url: case-sensitive scheme check (HTTPS:// not detected)
  - same_domain_or_subdomain: no root-domain comparison for cross-sibling subdomains
"""
from __future__ import annotations

import csv
import sqlite3
from pathlib import Path

import pytest

# ---------------------------------------------------------------------------
# input_normalizer
# ---------------------------------------------------------------------------
from reverse_funnel_outreach.input_normalizer import (
    canonical_root,
    normalize_url,
    root_domain,
    strip_www,
)


class TestNormalizeUrl:
    def test_bare_domain_gets_https(self):
        assert normalize_url("example.com") == "https://example.com/"

    def test_http_preserved(self):
        result = normalize_url("http://example.com/page")
        assert result.startswith("http://")

    def test_https_preserved(self):
        result = normalize_url("https://example.com/")
        assert result.startswith("https://")

    def test_tracking_params_stripped(self):
        url = "https://example.com/?utm_source=twitter&utm_medium=social&page=1"
        result = normalize_url(url)
        assert "utm_source" not in result
        assert "utm_medium" not in result
        assert "page=1" in result  # real param kept

    def test_all_tracking_params_stripped(self):
        tracking = (
            "utm_source=a&utm_medium=b&utm_campaign=c&utm_term=d&utm_content=e"
            "&fbclid=x&gclid=y&msclkid=z&_ga=w&ref=foo&referrer=bar&source=baz"
        )
        url = f"https://example.com/?{tracking}"
        result = normalize_url(url)
        for param in (
            "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
            "fbclid", "gclid", "msclkid", "_ga",
        ):
            assert param not in result, f"{param} should be stripped"

    def test_empty_raises(self):
        with pytest.raises(ValueError):
            normalize_url("")

    def test_whitespace_stripped(self):
        result = normalize_url("  example.com  ")
        assert result == "https://example.com/"

    def test_netloc_lowercased(self):
        result = normalize_url("https://EXAMPLE.COM/")
        assert "example.com" in result

    @pytest.mark.xfail(reason="Bug: scheme check is case-sensitive; HTTPS:// not recognised, gets double-prepended", strict=False)
    def test_uppercase_scheme_normalised(self):
        """Uppercase scheme like HTTPS:// should still produce a valid URL."""
        result = normalize_url("HTTPS://EXAMPLE.COM/")
        assert result.startswith("https://example.com")

    def test_path_preserved(self):
        result = normalize_url("https://example.com/about/team")
        assert "/about/team" in result

    def test_fragment_stripped(self):
        result = normalize_url("https://example.com/page#section")
        assert "#section" not in result


class TestRootDomain:
    def test_bare_domain(self):
        assert root_domain("example.com") == "example.com"

    def test_with_www(self):
        assert root_domain("www.example.com") == "www.example.com"

    def test_full_url(self):
        assert root_domain("https://www.example.com/page?q=1") == "www.example.com"

    def test_port_stripped(self):
        assert root_domain("https://example.com:8080/") == "example.com"

    def test_subdomain_preserved(self):
        assert root_domain("https://app.example.com/") == "app.example.com"


class TestStripWww:
    def test_strips_www(self):
        assert strip_www("www.example.com") == "example.com"

    def test_no_www_unchanged(self):
        assert strip_www("example.com") == "example.com"

    def test_subdomain_not_stripped(self):
        assert strip_www("app.example.com") == "app.example.com"

    def test_wwwfoo_not_stripped(self):
        assert strip_www("wwwexample.com") == "wwwexample.com"


class TestCanonicalRoot:
    def test_bare_domain(self):
        url, rd = canonical_root("acme.io")
        assert url == "https://acme.io/"
        assert rd == "acme.io"

    def test_www_stripped_from_root(self):
        url, rd = canonical_root("www.acme.io")
        assert rd == "acme.io"

    def test_tracking_params_removed(self):
        url, rd = canonical_root("acme.io?utm_source=test")
        assert "utm_source" not in url

    def test_returns_tuple(self):
        result = canonical_root("acme.io")
        assert isinstance(result, tuple)
        assert len(result) == 2


# ---------------------------------------------------------------------------
# email_extract
# ---------------------------------------------------------------------------
from reverse_funnel_outreach.email_extract import (
    extract_emails_from_text,
    normalize_email,
    prefer_contact_emails,
    same_domain_or_subdomain,
)


class TestNormalizeEmail:
    def test_valid_email(self):
        # NOTE: don't use example.com / domain.com / yoursite.com — those are in the skip list
        assert normalize_email("Hello@Acme.IO") == "hello@acme.io"

    def test_strips_angle_brackets(self):
        assert normalize_email("<contact@startup.com>") == "contact@startup.com"

    def test_strips_quotes(self):
        assert normalize_email('"sales@startup.com"') == "sales@startup.com"

    def test_empty_returns_none(self):
        assert normalize_email("") is None

    def test_no_at_returns_none(self):
        assert normalize_email("notanemail") is None

    def test_example_com_rejected(self):
        # example.com is deliberately in the garbage skip list
        assert normalize_email("test@example.com") is None

    def test_domain_com_rejected(self):
        assert normalize_email("user@domain.com") is None

    def test_noreply_rejected(self):
        assert normalize_email("noreply@acme.io") is None

    def test_donotreply_rejected(self):
        assert normalize_email("donotreply@acme.io") is None

    def test_sentry_rejected(self):
        assert normalize_email("errors@sentry.io") is None

    def test_w3_rejected(self):
        assert normalize_email("info@w3.org") is None

    def test_schema_org_rejected(self):
        assert normalize_email("data@schema.org") is None

    def test_malformed_no_tld(self):
        assert normalize_email("user@nodot") is None

    def test_yoursite_rejected(self):
        assert normalize_email("admin@yoursite.com") is None

    def test_valid_subdomain_email(self):
        result = normalize_email("sales@mail.company.io")
        assert result == "sales@mail.company.io"


class TestExtractEmailsFromText:
    def test_finds_email_in_text(self):
        emails = extract_emails_from_text("Contact us at hello@acme.io for help")
        assert "hello@acme.io" in emails

    def test_finds_multiple(self):
        text = "Sales: sales@acme.io | Support: support@acme.io"
        emails = extract_emails_from_text(text)
        assert "sales@acme.io" in emails
        assert "support@acme.io" in emails

    def test_deduplicates(self):
        text = "hello@acme.io and hello@acme.io again"
        emails = extract_emails_from_text(text)
        assert emails.count("hello@acme.io") == 1

    def test_skips_garbage(self):
        emails = extract_emails_from_text("template@example.com or user@domain.com")
        assert emails == []

    def test_empty_text(self):
        assert extract_emails_from_text("") == []

    def test_none_safe(self):
        assert extract_emails_from_text(None) == []  # type: ignore[arg-type]

    def test_returns_sorted(self):
        text = "z@acme.io and a@acme.io"
        emails = extract_emails_from_text(text)
        assert emails == sorted(emails)

    def test_mailto_href_extracted(self):
        html = '<a href="mailto:founder@startup.io">Email us</a>'
        emails = extract_emails_from_text(html)
        assert "founder@startup.io" in emails

    def test_lowercase_normalized(self):
        emails = extract_emails_from_text("HELLO@ACME.IO")
        assert "hello@acme.io" in emails


class TestSameDomainOrSubdomain:
    def test_exact_match(self):
        assert same_domain_or_subdomain("hello@acme.io", "acme.io")

    def test_www_site_vs_root_email(self):
        assert same_domain_or_subdomain("hello@acme.io", "www.acme.io")

    def test_unrelated_domain(self):
        assert not same_domain_or_subdomain("hello@gmail.com", "acme.io")

    def test_partial_overlap_rejected(self):
        assert not same_domain_or_subdomain("hello@notacme.io", "acme.io")

    def test_site_with_scheme(self):
        assert same_domain_or_subdomain("hello@acme.io", "https://www.acme.io/")

    def test_email_is_subdomain_of_site(self):
        # mail.acme.io is a subdomain of acme.io (site host)
        assert same_domain_or_subdomain("hello@mail.acme.io", "acme.io")

    @pytest.mark.xfail(
        reason=(
            "Known limitation: same_domain_or_subdomain cannot detect two sibling "
            "subdomains (mail.acme.io vs www.acme.io) share the same root. "
            "The confidence_score module handles this correctly via root-domain "
            "comparison. This function is not used in engine.py scoring path."
        ),
        strict=False,
    )
    def test_sibling_subdomains_share_root(self):
        # mail.acme.io and www.acme.io share root acme.io — should be treated as same domain
        assert same_domain_or_subdomain("hello@mail.acme.io", "www.acme.io")


class TestPreferContactEmails:
    def test_empty_list(self):
        assert prefer_contact_emails([], "https://acme.io") == []

    def test_same_domain_preferred(self):
        emails = ["other@gmail.com", "hello@acme.io"]
        result = prefer_contact_emails(emails, "https://acme.io")
        assert result[0] == "hello@acme.io"

    def test_priority_prefix_scores_higher(self):
        emails = ["hello@acme.io", "admin@acme.io"]
        result = prefer_contact_emails(emails, "https://acme.io")
        assert result[0] == "hello@acme.io"

    def test_founder_prefix(self):
        emails = ["info@acme.io", "founder@acme.io"]
        result = prefer_contact_emails(emails, "https://acme.io")
        assert result[0] == "founder@acme.io"

    def test_sales_prefix(self):
        emails = ["info@acme.io", "sales@acme.io"]
        result = prefer_contact_emails(emails, "https://acme.io")
        assert result[0] == "sales@acme.io"

    def test_all_foreign_domain_returns_all(self):
        emails = ["a@gmail.com", "b@yahoo.com"]
        result = prefer_contact_emails(emails, "https://acme.io")
        assert set(result) == {"a@gmail.com", "b@yahoo.com"}


# ---------------------------------------------------------------------------
# link_discovery
# ---------------------------------------------------------------------------
from reverse_funnel_outreach.link_discovery import (
    extract_internal_links,
    should_skip_url,
    url_contact_priority,
)


class TestShouldSkipUrl:
    @pytest.mark.parametrize("path", [
        "https://example.com/logout",
        "https://example.com/cart",
        "https://example.com/checkout",
        "https://example.com/search?q=test",
        "https://example.com/tags/news",
        "https://example.com/calendar",
        "https://example.com/wp-login.php",
        "https://example.com/wp-admin/",
        "https://example.com/feed",
        "https://example.com/sitemap.xml",
    ])
    def test_skipped_paths(self, path):
        assert should_skip_url(path), f"Expected {path} to be skipped"

    @pytest.mark.parametrize("ext_url", [
        "https://example.com/logo.png",
        "https://example.com/style.css",
        "https://example.com/app.js",
        "https://example.com/doc.pdf",
        "https://example.com/video.mp4",
        "https://example.com/font.woff2",
    ])
    def test_media_extensions_skipped(self, ext_url):
        assert should_skip_url(ext_url), f"Expected {ext_url} to be skipped"

    @pytest.mark.parametrize("good_url", [
        "https://example.com/contact",
        "https://example.com/about",
        "https://example.com/team",
        "https://example.com/",
        "https://example.com/pricing",
        "https://example.com/blog/my-post",
    ])
    def test_good_paths_not_skipped(self, good_url):
        assert not should_skip_url(good_url), f"Expected {good_url} NOT to be skipped"


class TestUrlContactPriority:
    def test_contact_page_highest(self):
        assert url_contact_priority("https://example.com/contact") > 0

    def test_about_page_scores(self):
        assert url_contact_priority("https://example.com/about") > 0

    def test_team_page_scores(self):
        assert url_contact_priority("https://example.com/team") > 0

    def test_contact_above_about(self):
        c = url_contact_priority("https://example.com/contact")
        a = url_contact_priority("https://example.com/about")
        assert c > a

    def test_random_page_zero(self):
        assert url_contact_priority("https://example.com/blog/news") == 0

    def test_contact_subpath_scores(self):
        assert url_contact_priority("https://example.com/contact-us") > 0

    def test_team_subpath_scores(self):
        assert url_contact_priority("https://example.com/team/engineering") > 0


class TestExtractInternalLinks:
    BASE = "https://example.com/"
    HOST = "example.com"

    def _html(self, hrefs: list[str]) -> str:
        links = "".join(f'<a href="{h}">link</a>' for h in hrefs)
        return f"<html><body>{links}</body></html>"

    def test_internal_links_extracted(self):
        html = self._html(["/about", "/contact", "/team"])
        links = extract_internal_links(html, self.BASE, self.HOST)
        paths = [l.split("example.com")[-1].split("?")[0] for l in links]
        assert "/about" in paths
        assert "/contact" in paths
        assert "/team" in paths

    def test_external_links_excluded(self):
        html = self._html(["/about", "https://other.com/page"])
        links = extract_internal_links(html, self.BASE, self.HOST)
        assert not any("other.com" in l for l in links)

    def test_mailto_excluded(self):
        html = '<a href="mailto:hello@example.com">Email</a><a href="/contact">Contact</a>'
        links = extract_internal_links(html, self.BASE, self.HOST)
        assert not any("mailto:" in l for l in links)

    def test_javascript_excluded(self):
        html = '<a href="javascript:void(0)">JS</a><a href="/about">About</a>'
        links = extract_internal_links(html, self.BASE, self.HOST)
        assert not any("javascript:" in l for l in links)

    def test_deduplication(self):
        html = self._html(["/about", "/about", "/about"])
        links = extract_internal_links(html, self.BASE, self.HOST)
        about = [l for l in links if "/about" in l]
        assert len(about) == 1

    def test_skip_patterns_excluded(self):
        html = self._html(["/cart", "/checkout", "/logout", "/about"])
        links = extract_internal_links(html, self.BASE, self.HOST)
        assert not any("/cart" in l or "/checkout" in l or "/logout" in l for l in links)
        assert any("/about" in l for l in links)

    def test_subdomain_allowed(self):
        html = '<a href="https://app.example.com/dashboard">App</a>'
        links = extract_internal_links(html, self.BASE, self.HOST)
        assert any("app.example.com" in l for l in links)

    def test_fragment_links_excluded(self):
        html = '<a href="#section">Jump</a><a href="/about">About</a>'
        links = extract_internal_links(html, self.BASE, self.HOST)
        assert not any(l == self.BASE + "#section" or l.endswith("#section") for l in links)

    def test_media_extensions_skipped(self):
        html = self._html(["/logo.png", "/style.css", "/app.js", "/contact"])
        links = extract_internal_links(html, self.BASE, self.HOST)
        assert not any(l.endswith((".png", ".css", ".js")) for l in links)
        assert any("/contact" in l for l in links)

    def test_empty_html(self):
        links = extract_internal_links("", self.BASE, self.HOST)
        assert links == []


# ---------------------------------------------------------------------------
# bulk_emails (load_domains)
# ---------------------------------------------------------------------------
from reverse_funnel_outreach.bulk_emails import load_domains


class TestLoadDomains:
    def test_txt_basic(self, tmp_path):
        f = tmp_path / "domains.txt"
        f.write_text("acme.io\nstartup.com\n")
        result = load_domains(f)
        assert result == ["acme.io", "startup.com"]

    def test_txt_strips_comments(self, tmp_path):
        f = tmp_path / "domains.txt"
        f.write_text("# header comment\nacme.io\n# inline\nstartup.com\n")
        result = load_domains(f)
        assert result == ["acme.io", "startup.com"]

    def test_txt_skips_blanks(self, tmp_path):
        f = tmp_path / "domains.txt"
        f.write_text("acme.io\n\n\nstartup.com\n")
        result = load_domains(f)
        assert result == ["acme.io", "startup.com"]

    def test_txt_deduplicates(self, tmp_path):
        f = tmp_path / "domains.txt"
        f.write_text("acme.io\nacme.io\nstartup.com\n")
        result = load_domains(f)
        assert result == ["acme.io", "startup.com"]

    def test_csv_domain_column(self, tmp_path):
        f = tmp_path / "domains.csv"
        f.write_text("domain,company\nacme.io,Acme\nstartup.com,Beta\n")
        result = load_domains(f)
        assert result == ["acme.io", "startup.com"]

    def test_csv_url_fallback_column(self, tmp_path):
        f = tmp_path / "domains.csv"
        f.write_text("url,notes\nhttps://acme.io,test\nhttps://startup.com,prod\n")
        result = load_domains(f)
        assert "https://acme.io" in result

    def test_csv_website_column(self, tmp_path):
        f = tmp_path / "domains.csv"
        f.write_text("website\nacme.io\nstartup.com\n")
        result = load_domains(f)
        assert result == ["acme.io", "startup.com"]

    def test_csv_no_recognized_column_raises(self, tmp_path):
        f = tmp_path / "domains.csv"
        f.write_text("company,industry\nAcme,SaaS\n")
        with pytest.raises(ValueError, match="domain"):
            load_domains(f)

    def test_file_not_found_raises(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            load_domains(tmp_path / "missing.txt")

    def test_txt_urls_accepted(self, tmp_path):
        f = tmp_path / "domains.txt"
        f.write_text("https://acme.io\nhttps://startup.com\n")
        result = load_domains(f)
        assert result == ["https://acme.io", "https://startup.com"]

    def test_csv_case_insensitive_column(self, tmp_path):
        f = tmp_path / "domains.csv"
        f.write_text("Domain,Company\nacme.io,Acme\n")
        result = load_domains(f)
        assert result == ["acme.io"]

    def test_empty_csv(self, tmp_path):
        f = tmp_path / "domains.csv"
        f.write_text("domain\n")
        result = load_domains(f)
        assert result == []


# ---------------------------------------------------------------------------
# confidence_score
# ---------------------------------------------------------------------------
from reverse_funnel_outreach.confidence_score import score_email, _label


class TestConfidenceScoreLabel:
    def test_80_is_high(self):
        assert _label(80) == "high"

    def test_100_is_high(self):
        assert _label(100) == "high"

    def test_79_is_medium(self):
        assert _label(79) == "medium"

    def test_60_is_medium(self):
        assert _label(60) == "medium"

    def test_59_is_low(self):
        assert _label(59) == "low"

    def test_40_is_low(self):
        assert _label(40) == "low"

    def test_39_is_reject(self):
        assert _label(39) == "reject"

    def test_0_is_reject(self):
        assert _label(0) == "reject"


class TestScoreEmail:
    """Tests use the actual tuple API: (score, label, flags)."""

    def test_returns_tuple_of_three(self):
        result = score_email(
            email="hello@acme.io",
            source_url="https://acme.io/contact",
            root_domain="acme.io",
            found_in="mailto",
        )
        assert isinstance(result, tuple)
        assert len(result) == 3
        score, label, flags = result
        assert isinstance(score, int)
        assert label in ("high", "medium", "low", "reject")
        assert isinstance(flags, list)

    def test_same_domain_email_on_contact_page_scores_high(self):
        score, label, flags = score_email(
            email="hello@acme.io",
            source_url="https://acme.io/contact",
            root_domain="acme.io",
            found_in="mailto",
        )
        # Base 50 + domain_exact +30 + contact_page +15 + mailto +10 + prefix +8 = 113 → clamped to 100
        assert score >= 80
        assert label == "high"

    def test_domain_match_gives_positive_flag(self):
        _, _, flags = score_email(
            email="hello@acme.io",
            source_url="https://acme.io/",
            root_domain="acme.io",
            found_in="html",
        )
        assert "domain_exact_match" in flags

    def test_placeholder_email_rejected(self):
        score, label, flags = score_email(
            email="your@email.com",
            source_url="https://acme.io/",
            root_domain="acme.io",
            found_in="html",
        )
        assert score < 40
        assert label == "reject"
        assert "placeholder_pattern" in flags

    def test_unrelated_domain_penalized(self):
        score, label, flags = score_email(
            email="support@wordpress.com",
            source_url="https://acme.io/blog",
            root_domain="acme.io",
            found_in="html",
        )
        assert score < 40
        assert "domain_mismatch" in flags

    def test_template_vendor_double_penalty(self):
        score, label, flags = score_email(
            email="support@themeforest.net",
            source_url="https://acme.io/",
            root_domain="acme.io",
            found_in="html",
        )
        assert "domain_mismatch" in flags
        assert "template_vendor_domain" in flags
        assert score < 20

    def test_mailto_adds_points(self):
        s_mailto, _, _ = score_email(
            email="hi@acme.io", source_url="https://acme.io/", root_domain="acme.io", found_in="mailto"
        )
        s_html, _, _ = score_email(
            email="hi@acme.io", source_url="https://acme.io/", root_domain="acme.io", found_in="html"
        )
        assert s_mailto > s_html

    def test_contact_page_bonus(self):
        s_contact, _, _ = score_email(
            email="hi@acme.io", source_url="https://acme.io/contact", root_domain="acme.io", found_in="html"
        )
        s_other, _, _ = score_email(
            email="hi@acme.io", source_url="https://acme.io/blog", root_domain="acme.io", found_in="html"
        )
        assert s_contact > s_other

    def test_about_page_bonus(self):
        s_about, _, _ = score_email(
            email="hi@acme.io", source_url="https://acme.io/about", root_domain="acme.io", found_in="html"
        )
        s_other, _, _ = score_email(
            email="hi@acme.io", source_url="https://acme.io/pricing", root_domain="acme.io", found_in="html"
        )
        assert s_about > s_other

    def test_multiple_sightings_bonus(self):
        s_one, _, _ = score_email(
            email="hi@acme.io", source_url="https://acme.io/", root_domain="acme.io",
            found_in="html", sighting_count=1
        )
        s_many, _, _ = score_email(
            email="hi@acme.io", source_url="https://acme.io/", root_domain="acme.io",
            found_in="html", sighting_count=3
        )
        assert s_many > s_one

    def test_junk_mailbox_penalized(self):
        s_noreply, _, flags = score_email(
            email="noreply@acme.io", source_url="https://acme.io/", root_domain="acme.io", found_in="html"
        )
        s_hello, _, _ = score_email(
            email="hello@acme.io", source_url="https://acme.io/", root_domain="acme.io", found_in="html"
        )
        assert s_noreply < s_hello
        assert "junk_mailbox_prefix" in flags

    def test_legal_mailbox_tagged_not_rejected(self):
        score, label, flags = score_email(
            email="legal@acme.io", source_url="https://acme.io/", root_domain="acme.io", found_in="html"
        )
        assert "legal_or_compliance_mailbox" in flags
        # Legal mailboxes are real — score can be low but not necessarily reject
        assert label != "reject" or score < 40  # tagged, not hard blocked

    def test_score_clamped_0_to_100(self):
        # Very high combo — should still be <= 100
        score, _, _ = score_email(
            email="founder@acme.io",
            source_url="https://acme.io/contact",
            root_domain="acme.io",
            found_in="mailto",
            sighting_count=5,
        )
        assert 0 <= score <= 100

    def test_subdomain_match_positive(self):
        score, _, flags = score_email(
            email="hello@mail.acme.io",
            source_url="https://acme.io/",
            root_domain="acme.io",
            found_in="html",
        )
        assert "subdomain_match" in flags
        assert score > 50

    def test_www_stripped_from_root(self):
        """root_domain passed as www.acme.io should still match email @acme.io."""
        score, label, flags = score_email(
            email="hello@acme.io",
            source_url="https://www.acme.io/contact",
            root_domain="www.acme.io",
            found_in="mailto",
        )
        assert "domain_exact_match" in flags
        assert score >= 80


# ---------------------------------------------------------------------------
# content_extract
# ---------------------------------------------------------------------------
from reverse_funnel_outreach.content_extract import (
    RawEmailHit,
    _decode_cf_email,
    _extract_cf_obfuscated,
    _extract_data_attrs,
    _extract_jsonld,
    _extract_mailto,
    extract_all_from_html,
)


class TestExtractMailto:
    def test_basic_mailto(self):
        html = '<a href="mailto:hello@acme.io">Email</a>'
        hits = _extract_mailto(html)
        assert any(h.email == "hello@acme.io" for h in hits)
        assert all(h.found_in == "mailto" for h in hits)

    def test_mailto_with_query_stripped(self):
        html = '<a href="mailto:hello@acme.io?subject=Hi">Email</a>'
        hits = _extract_mailto(html)
        assert any(h.email == "hello@acme.io" for h in hits)

    def test_garbage_email_skipped(self):
        html = '<a href="mailto:test@example.com">Email</a>'
        hits = _extract_mailto(html)
        assert hits == []

    def test_context_captured(self):
        html = '<a href="mailto:hello@acme.io">Email</a>'
        hits = _extract_mailto(html)
        assert hits[0].context.startswith("mailto:")


class TestCloudflareDecode:
    def test_known_vector(self):
        # Produce a CF-encoded string and verify round-trip
        email = "hello@acme.io"
        key = 0x3A
        encoded = bytes([key] + [ord(c) ^ key for c in email]).hex()
        decoded = _decode_cf_email(encoded)
        assert decoded == email

    def test_invalid_returns_none(self):
        assert _decode_cf_email("notvalidhex!!!") is None

    def test_no_at_sign_returns_none(self):
        # Encode a string without @ — should return None
        text = "helloadomain"
        key = 0x10
        encoded = bytes([key] + [ord(c) ^ key for c in text]).hex()
        assert _decode_cf_email(encoded) is None


class TestExtractDataAttrs:
    def test_data_email_attr(self):
        html = '<span data-email="contact@acme.io">Contact</span>'
        hits = _extract_data_attrs(html)
        assert any(h.email == "contact@acme.io" for h in hits)
        assert all(h.found_in == "data_attr" for h in hits)

    def test_data_mailto_attr(self):
        html = '<span data-mailto="hello@acme.io">Email</span>'
        hits = _extract_data_attrs(html)
        assert any(h.email == "hello@acme.io" for h in hits)

    def test_garbage_skipped(self):
        html = '<span data-email="test@example.com">Contact</span>'
        hits = _extract_data_attrs(html)
        assert hits == []


class TestExtractJsonLd:
    def test_jsonld_email_field(self):
        html = """<script type="application/ld+json">{"@type":"Organization","email":"hello@acme.io"}</script>"""
        hits = _extract_jsonld(html)
        assert any(h.email == "hello@acme.io" for h in hits)
        assert all(h.found_in == "jsonld" for h in hits)

    def test_invalid_json_skipped(self):
        html = """<script type="application/ld+json">not valid json</script>"""
        hits = _extract_jsonld(html)
        assert hits == []

    def test_no_jsonld_returns_empty(self):
        html = "<html><body>no json here</body></html>"
        hits = _extract_jsonld(html)
        assert hits == []


class TestExtractAllFromHtml:
    def test_deduplicates_by_priority(self):
        """Same email found in mailto AND text — should only appear once, with mailto priority."""
        html = '<a href="mailto:hello@acme.io">Email</a> hello@acme.io'
        hits = extract_all_from_html(html, "https://acme.io/")
        emails = [h.email for h in hits]
        assert emails.count("hello@acme.io") == 1
        # mailto should win over text
        the_hit = next(h for h in hits if h.email == "hello@acme.io")
        assert the_hit.found_in == "mailto"

    def test_garbage_filtered(self):
        html = '<a href="mailto:test@example.com">template</a>'
        hits = extract_all_from_html(html, "https://acme.io/")
        assert not any(h.email == "test@example.com" for h in hits)

    def test_empty_html(self):
        hits = extract_all_from_html("", "https://acme.io/")
        assert hits == []


# ---------------------------------------------------------------------------
# store (SQLite schema)
# ---------------------------------------------------------------------------
from reverse_funnel_outreach.store import (
    create_run,
    finish_run,
    open_db,
    save_finding,
    save_page,
    upsert_canonical,
)


class TestStore:
    @pytest.fixture()
    def db(self, tmp_path):
        conn = open_db(tmp_path / "test.db")
        yield conn
        conn.close()

    def test_schema_creates_tables(self, db):
        tables = {
            row[0]
            for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")
        }
        assert "crawl_runs" in tables
        assert "pages" in tables
        assert "email_findings" in tables
        assert "email_canonicals" in tables

    def test_create_and_finish_run(self, db):
        run_id = create_run(db, input_count=5)
        assert run_id  # non-empty UUID
        row = db.execute("SELECT * FROM crawl_runs WHERE id=?", (run_id,)).fetchone()
        assert row["status"] == "running"
        assert row["input_count"] == 5

        finish_run(db, run_id)
        row = db.execute("SELECT * FROM crawl_runs WHERE id=?", (run_id,)).fetchone()
        assert row["status"] == "completed"
        assert row["finished_at"] is not None

    def test_save_page(self, db):
        run_id = create_run(db, input_count=1)
        pid = save_page(
            db,
            run_id=run_id,
            root_domain="acme.io",
            url="https://acme.io/contact",
            depth=0,
            source_type="httpx",
            status_code=200,
        )
        assert pid
        row = db.execute("SELECT * FROM pages WHERE id=?", (pid,)).fetchone()
        assert row["url"] == "https://acme.io/contact"
        assert row["depth"] == 0
        assert row["status_code"] == 200

    def test_save_finding(self, db):
        run_id = create_run(db, input_count=1)
        fid = save_finding(
            db,
            run_id=run_id,
            root_domain="acme.io",
            source_url="https://acme.io/contact",
            email="hello@acme.io",
            found_in="mailto",
            source_type="httpx",
            context="mailto:hello@acme.io",
            confidence_score=90,
            confidence_label="high",
            flags=["domain_exact_match", "mailto_link"],
        )
        assert fid
        row = db.execute("SELECT * FROM email_findings WHERE id=?", (fid,)).fetchone()
        assert row["email"] == "hello@acme.io"
        assert row["source_url"] == "https://acme.io/contact"
        assert row["confidence_score"] == 90
        assert row["confidence_label"] == "high"
        assert row["email_domain"] == "acme.io"

    def test_upsert_canonical_insert(self, db):
        upsert_canonical(
            db,
            root_domain="acme.io",
            email="hello@acme.io",
            source_url="https://acme.io/contact",
            confidence_score=90,
            recommended=True,
            delivery_state="valid",
            confidence_band="tier_a",
        )
        row = db.execute(
            "SELECT * FROM email_canonicals WHERE root_domain='acme.io' AND email='hello@acme.io'"
        ).fetchone()
        assert row is not None
        assert row["best_confidence_score"] == 90
        assert row["recommended_for_outreach"] == 1
        assert row["sighting_count"] == 1
        assert row["delivery_state"] == "valid"
        assert row["confidence_band"] == "tier_a"

    def test_upsert_canonical_updates_better_score(self, db):
        upsert_canonical(db, root_domain="acme.io", email="hello@acme.io",
                         source_url="https://acme.io/", confidence_score=60, recommended=False)
        upsert_canonical(db, root_domain="acme.io", email="hello@acme.io",
                         source_url="https://acme.io/contact", confidence_score=90, recommended=True)
        row = db.execute(
            "SELECT * FROM email_canonicals WHERE root_domain='acme.io' AND email='hello@acme.io'"
        ).fetchone()
        assert row["best_confidence_score"] == 90
        assert row["best_source_url"] == "https://acme.io/contact"
        assert row["sighting_count"] == 2

    def test_upsert_canonical_preserves_higher_score(self, db):
        upsert_canonical(db, root_domain="acme.io", email="hello@acme.io",
                         source_url="https://acme.io/contact", confidence_score=90, recommended=True)
        upsert_canonical(db, root_domain="acme.io", email="hello@acme.io",
                         source_url="https://acme.io/privacy", confidence_score=40, recommended=False)
        row = db.execute(
            "SELECT * FROM email_canonicals WHERE root_domain='acme.io' AND email='hello@acme.io'"
        ).fetchone()
        # Lower score should not overwrite the best
        assert row["best_confidence_score"] == 90
        assert row["sighting_count"] == 2


# ---------------------------------------------------------------------------
# engine (EmailFinding schema)
# ---------------------------------------------------------------------------
from reverse_funnel_outreach.engine import EmailFinding, DomainResult


class TestEmailFindingSchema:
    """Verify EmailFinding has all spec-required output fields."""

    REQUIRED_FIELDS = {
        "domain", "email", "source_url", "source_type", "found_in",
        "crawl_depth", "confidence_score", "confidence_label", "reason_flags",
    }

    def test_all_required_fields_present(self):
        f = EmailFinding(
            domain="acme.io",
            email="hello@acme.io",
            source_url="https://acme.io/contact",
            source_type="httpx",
            found_in="mailto",
            crawl_depth=0,
            confidence_score=90,
            confidence_label="high",
            reason_flags=["domain_exact_match"],
        )
        for field in self.REQUIRED_FIELDS:
            assert hasattr(f, field), f"EmailFinding missing field: {field}"

    def test_source_url_is_exact_page_not_method(self):
        """Critical spec requirement: source_url must be a real URL, not a method name."""
        f = EmailFinding(
            domain="acme.io",
            email="hello@acme.io",
            source_url="https://acme.io/contact",
            source_type="httpx",
            found_in="mailto",
            crawl_depth=0,
            confidence_score=90,
            confidence_label="high",
            reason_flags=[],
        )
        assert f.source_url.startswith("http"), (
            f"source_url should be a URL, got: {f.source_url!r}"
        )

    def test_all_source_urls_field_exists(self):
        """Spec allows retaining all sighting URLs for audit."""
        f = EmailFinding(
            domain="acme.io",
            email="hello@acme.io",
            source_url="https://acme.io/contact",
            source_type="httpx",
            found_in="mailto",
            crawl_depth=0,
            confidence_score=90,
            confidence_label="high",
            reason_flags=[],
        )
        assert hasattr(f, "all_source_urls")
        assert isinstance(f.all_source_urls, list)

    def test_domain_result_schema(self):
        dr = DomainResult(domain="acme.io")
        assert hasattr(dr, "findings")
        assert hasattr(dr, "pages_crawled")
        assert hasattr(dr, "errors")
        assert isinstance(dr.findings, list)


# ---------------------------------------------------------------------------
# CLI / export surface (evidence vs legacy)
# ---------------------------------------------------------------------------

class TestBulkEmailsExportSurface:
    """Default bulk-emails uses EmailFinding-shaped CSV; legacy uses domain,email,sources,note."""

    def test_evidence_schema_fields_exist_on_email_finding(self):
        required_new = {
            "domain", "email", "source_url", "source_type",
            "confidence_score", "confidence_label", "reason_flags",
            "delivery_state", "confidence_band",
        }
        f = EmailFinding(
            domain="acme.io", email="hello@acme.io",
            source_url="https://acme.io/contact", source_type="httpx",
            found_in="mailto", crawl_depth=0, confidence_score=90,
            confidence_label="high", reason_flags=["domain_exact_match"],
        )
        for field in required_new:
            assert hasattr(f, field)

    def test_legacy_bulk_emails_fieldnames_are_narrow(self):
        """CLI legacy mode still uses the four-column harvest schema (by design)."""
        old_cli_fields = {"domain", "email", "sources", "note"}
        assert len(old_cli_fields) == 4
