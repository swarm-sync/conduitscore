#!/bin/bash

echo "=== Verifying URL Validation Deployed ==="
echo ""

for attempt in {1..3}; do
  echo "Attempt $attempt: Testing invalid URL..."
  
  RESPONSE=$(curl -s -X POST "https://website-phi-ten-25.vercel.app/api/scan" \
    -H "Content-Type: application/json" \
    -d '{"url":"not-a-valid-url"}')
  
  if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    ERROR=$(echo "$RESPONSE" | jq -r '.error')
    echo "✓ SUCCESS - Invalid URL rejected with: $ERROR"
    break
  else
    echo "⚠ Still showing old behavior, waiting..."
    sleep 3
  fi
done

echo ""
echo "=== Final Validation ==="
echo "Valid URL: https://example.com"
VALID=$(curl -s -X POST "https://website-phi-ten-25.vercel.app/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' | jq -r '.overallScore // "ERROR"')
echo "  Result: Score $VALID/100"

echo ""
echo "Invalid URL: not-a-url"
INVALID=$(curl -s -X POST "https://website-phi-ten-25.vercel.app/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"url":"not-a-url"}' | jq -r '.error // "ACCEPTED"')
echo "  Result: $INVALID"

