# PHASE 4: SECURITY EXPOSURE AUDIT

$url = "https://www.conduitscore.com"
$findings = @()

# Test sensitive paths (passive only, no bruteforce)
$sensitiveTests = @(
    "/.git/config",
    "/.env",
    "/.env.production",
    "/config.yml",
    "/.well-known/agent-card.json",
    "/llms.txt",
    "/llms-full.txt",
    "/.env.local",
    "/backup.zip",
    "/.DS_Store"
)

Write-Host "=== PHASE 4: SECURITY RECON ==="
Write-Host "Testing sensitive path categories..."
Write-Host ""

foreach ($path in $sensitiveTests) {
    try {
        $testUrl = "$url$path"
        $response = Invoke-WebRequest -Uri $testUrl -Method HEAD -TimeoutSec 5 -ErrorAction Stop -SkipHttpErrorCheck
        
        if ($response.StatusCode -eq 200) {
            $findings += "HIGH: Exposed path found - $path (status 200)"
        } elseif ($response.StatusCode -eq 403) {
            Write-Host "✓ $path - Protected (403)" -ForegroundColor Green
        } else {
            Write-Host "○ $path - Not found ($($response.StatusCode))" -ForegroundColor Gray
        }
    } catch {
        # Most paths will error - that's expected
    }
}

# Check security headers
Write-Host ""
Write-Host "Checking security headers..."

$response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction Stop
$headers = $response.Headers

$securityHeaders = @{
    "Strict-Transport-Security" = "HSTS"
    "Content-Security-Policy" = "CSP"
    "X-Frame-Options" = "Clickjack protection"
    "X-Content-Type-Options" = "MIME-sniffing protection"
    "Referrer-Policy" = "Referrer policy"
}

foreach ($header in $securityHeaders.Keys) {
    $value = $response.Headers[$header]
    if ($value) {
        Write-Host "✓ $header: Present" -ForegroundColor Green
    } else {
        Write-Host "⚠ $header: Missing" -ForegroundColor Yellow
    }
}

# Check CORS
Write-Host ""
Write-Host "Testing CORS policy..."
$corsResponse = Invoke-WebRequest -Uri "$url/api/health" -Headers @{"Origin"="https://evil.com"} -TimeoutSec 5 -ErrorAction Stop

if ($corsResponse.Headers['Access-Control-Allow-Origin']) {
    Write-Host "⚠ CORS is configured (may be too permissive)" -ForegroundColor Yellow
} else {
    Write-Host "✓ CORS is restrictive/not set" -ForegroundColor Green
}

if ($findings.Count -gt 0) {
    Write-Host ""
    Write-Host "FINDINGS:" -ForegroundColor Red
    $findings | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host ""
    Write-Host "No sensitive paths exposed ✓" -ForegroundColor Green
}
