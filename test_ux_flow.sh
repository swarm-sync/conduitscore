#!/bin/bash

SITE_URL="https://website-phi-ten-25.vercel.app"

echo "=== TEST 1: Landing Page HTML Structure ==="
curl -s "$SITE_URL" | grep -o 'class="[^"]*"' | head -20 | while read class; do
  echo "  Found: $class"
done

echo -e "\n=== TEST 2: Check for ScanForm Component ==="
# Check if the page has the necessary form structure
FORM_CHECK=$(curl -s "$SITE_URL" | grep -c "handleScan\|Scan Free\|type=\"url\"")
echo "Form elements found: $FORM_CHECK references"

# Check for React script references
if curl -s "$SITE_URL" | grep -q "_next"; then
  echo "✓ Next.js bundle detected"
fi

# Check for TypeScript/JavaScript bundle
if curl -s "$SITE_URL" | grep -q "\"use client\""; then
  echo "✓ Client component directive found in static HTML (inline)"
fi

echo -e "\n=== TEST 3: Check Dashboard Page ==="
DASHBOARD_URL="$SITE_URL/dashboard"
DASHBOARD_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$DASHBOARD_URL")
echo "Dashboard status: $DASHBOARD_HTTP"

if [ "$DASHBOARD_HTTP" = "200" ]; then
  if curl -s "$DASHBOARD_URL" | grep -q "Scan"; then
    echo "✓ Dashboard has scan functionality"
  fi
fi

echo -e "\n=== TEST 4: API Rate Limiting ==="
echo "Testing rate limit on /api/scan..."
for i in {1..3}; do
  RESPONSE=$(curl -s -X POST "$SITE_URL/api/scan" \
    -H "Content-Type: application/json" \
    -d '{"url":"https://httpbin.org"}' \
    -w "\nHTTP_STATUS:%{http_code}")
  
  HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
  BODY=$(echo "$RESPONSE" | sed '$ d')
  
  if echo "$BODY" | jq -e '.error' > /dev/null 2>&1; then
    ERROR=$(echo "$BODY" | jq -r '.error')
    echo "  Request $i: $HTTP_CODE - $ERROR"
  else
    SCORE=$(echo "$BODY" | jq -r '.overallScore // "N/A"')
    echo "  Request $i: $HTTP_CODE - Score: $SCORE"
  fi
done

echo -e "\n=== TEST 5: Error Handling ==="
echo "Testing with invalid URL..."
ERROR_RESPONSE=$(curl -s -X POST "$SITE_URL/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"url":"not-a-valid-url"}' \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_CODE=$(echo "$ERROR_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$ERROR_RESPONSE" | sed '$ d')

echo "Status: $HTTP_CODE"
if [ "$HTTP_CODE" != "200" ]; then
  echo "✓ Invalid URL properly rejected"
  echo "  Error: $(echo "$BODY" | jq -r '.error // "N/A"')"
else
  echo "✗ Invalid URL was accepted (should reject)"
fi

echo -e "\n=== TEST 6: Performance ==="
echo "Testing scan performance with multiple sites..."

for url in "https://example.com" "https://github.com" "https://news.ycombinator.com"; do
  START=$(date +%s%N)
  RESULT=$(curl -s -X POST "$SITE_URL/api/scan" \
    -H "Content-Type: application/json" \
    -d "{\"url\":\"$url\"}")
  END=$(date +%s%N)
  
  ELAPSED_MS=$(( (END - START) / 1000000 ))
  SCORE=$(echo "$RESULT" | jq -r '.overallScore // "ERROR"')
  LOAD_TIME=$(echo "$RESULT" | jq -r '.metadata.loadTimeMs // 0')
  
  echo "  $url"
  echo "    Total Time: ${ELAPSED_MS}ms | Load Time: ${LOAD_TIME}ms | Score: $SCORE"
done

echo -e "\n=== TEST 7: Scan Result Fields Completeness ==="
TEST_SCAN=$(curl -s -X POST "$SITE_URL/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}')

REQUIRED_FIELDS=("url" "overallScore" "categories" "issues" "fixes" "scannedAt" "metadata")

for field in "${REQUIRED_FIELDS[@]}"; do
  if echo "$TEST_SCAN" | jq -e ".$field" > /dev/null 2>&1; then
    echo "✓ $field present"
  else
    echo "✗ $field MISSING"
  fi
done

