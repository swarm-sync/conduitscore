#!/bin/bash

echo "=== Testing URL Validation Fix ==="
echo ""
echo "Testing invalid URLs with production API..."
echo ""

# The production site should auto-redeploy due to Vercel auto-deploy
# But let's verify what the expected behavior should be

echo "Test 1: Valid URL"
curl -s -X POST "https://website-phi-ten-25.vercel.app/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' | jq '.overallScore' | head -1

echo ""
echo "Test 2: Invalid URL format (should now be rejected)"
RESPONSE=$(curl -s -X POST "https://website-phi-ten-25.vercel.app/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"url":"not-a-valid-url"}')

STATUS=$(echo "$RESPONSE" | jq -r '.error // "success"')
echo "Response: $STATUS"

if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  ERROR=$(echo "$RESPONSE" | jq -r '.error')
  echo "✓ Invalid URL properly rejected with error: $ERROR"
else
  echo "⚠ Invalid URL still accepted (validation not yet deployed)"
fi

echo ""
echo "Test 3: Missing URL"
curl -s -X POST "https://website-phi-ten-25.vercel.app/api/scan" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.error'

echo ""
echo "Test 4: Multiple valid URLs"
for url in "https://github.com" "https://news.ycombinator.com"; do
  SCORE=$(curl -s -X POST "https://website-phi-ten-25.vercel.app/api/scan" \
    -H "Content-Type: application/json" \
    -d "{\"url\":\"$url\"}" | jq -r '.overallScore // "ERROR"')
  echo "  $url → Score: $SCORE"
done

