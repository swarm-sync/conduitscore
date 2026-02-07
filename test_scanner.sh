#!/bin/bash

SITE_URL="https://website-phi-ten-25.vercel.app"
SCAN_ENDPOINT="https://website-phi-ten-25.vercel.app/api/scan"

echo "=== TEST 1: Landing Page Load ==="
HTTP_CODE=$(curl -s -o /tmp/homepage.html -w "%{http_code}" "$SITE_URL")
echo "Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
  echo "✓ Homepage loads successfully"
  
  # Check for scanner form
  if grep -q "Scan Free" /tmp/homepage.html; then
    echo "✓ Scanner button text found"
  else
    echo "✗ Scanner button text NOT found"
  fi
  
  if grep -q "type=\"url\"" /tmp/homepage.html; then
    echo "✓ URL input type found"
  else
    echo "✗ URL input type NOT found"
  fi
else
  echo "✗ Homepage failed with status $HTTP_CODE"
fi

echo -e "\n=== TEST 2: Scanner API - Scan example.com ==="
SCAN_RESULT=$(curl -s -X POST "$SCAN_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}')

echo "$SCAN_RESULT" | jq . 2>/dev/null || echo "$SCAN_RESULT"

echo -e "\n=== TEST 3: Result Validation ==="
SCORE=$(echo "$SCAN_RESULT" | jq -r '.overallScore' 2>/dev/null)
CATEGORIES=$(echo "$SCAN_RESULT" | jq -r '.categories | length' 2>/dev/null)
ISSUES=$(echo "$SCAN_RESULT" | jq -r '.issues | length' 2>/dev/null)
FIXES=$(echo "$SCAN_RESULT" | jq -r '.fixes | length' 2>/dev/null)

if [ ! -z "$SCORE" ] && [ "$SCORE" != "null" ]; then
  echo "✓ Overall Score: $SCORE/100"
else
  echo "✗ Score extraction failed"
fi

if [ ! -z "$CATEGORIES" ] && [ "$CATEGORIES" != "null" ]; then
  echo "✓ Categories: $CATEGORIES"
else
  echo "✗ Categories extraction failed"
fi

if [ ! -z "$ISSUES" ] && [ "$ISSUES" != "null" ]; then
  echo "✓ Issues found: $ISSUES"
else
  echo "✗ Issues extraction failed"
fi

if [ ! -z "$FIXES" ] && [ "$FIXES" != "null" ]; then
  echo "✓ Fixes available: $FIXES"
else
  echo "✗ Fixes extraction failed"
fi

echo -e "\n=== TEST 4: Response Structure ==="
if echo "$SCAN_RESULT" | jq -e '.url' > /dev/null 2>&1; then
  echo "✓ url field present"
fi

if echo "$SCAN_RESULT" | jq -e '.scannedAt' > /dev/null 2>&1; then
  echo "✓ scannedAt field present"
fi

if echo "$SCAN_RESULT" | jq -e '.metadata' > /dev/null 2>&1; then
  echo "✓ metadata field present"
  LOAD_TIME=$(echo "$SCAN_RESULT" | jq -r '.metadata.loadTimeMs' 2>/dev/null)
  echo "  Load Time: ${LOAD_TIME}ms"
fi

if echo "$SCAN_RESULT" | jq -e '.categories | .[0]' > /dev/null 2>&1; then
  FIRST_CAT=$(echo "$SCAN_RESULT" | jq -r '.categories[0].name' 2>/dev/null)
  echo "✓ First category: $FIRST_CAT"
fi

if echo "$SCAN_RESULT" | jq -e '.issues | .[0]' > /dev/null 2>&1; then
  FIRST_ISSUE=$(echo "$SCAN_RESULT" | jq -r '.issues[0].title' 2>/dev/null)
  echo "✓ First issue: $FIRST_ISSUE"
fi

if echo "$SCAN_RESULT" | jq -e '.fixes | .[0]' > /dev/null 2>&1; then
  FIRST_FIX=$(echo "$SCAN_RESULT" | jq -r '.fixes[0].title' 2>/dev/null)
  echo "✓ First fix: $FIRST_FIX"
fi

