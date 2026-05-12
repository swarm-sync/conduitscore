If your live site is https://conduitscore.com, then the API URLs are:

1. Public score check
Anyone can use this one. No login or API key.

GET https://conduitscore.com/api/public/domain/{domain}/score

Example:

curl "https://conduitscore.com/api/public/domain/example.com/score"
Example response:

{
  "domain": "example.com",
  "score": 67,
  "grade": "B",
  "scanned_at": "2026-03-26T00:00:00.000Z"
}
This is implemented in route.ts.

2. Run a full scan
This is the main programmatic scan endpoint.

POST https://conduitscore.com/api/scan

Body:

{
  "url": "example.com"
}
Example:

curl -X POST "https://conduitscore.com/api/scan" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d "{\"url\":\"example.com\"}"
This is implemented in route.ts.

3. List past scans
GET https://conduitscore.com/api/scans?page=1&limit=20

Example:

curl "https://conduitscore.com/api/scans?page=1&limit=20" \
  -H "x-api-key: YOUR_API_KEY"
This is implemented in route.ts.

4. Get one scan
GET https://conduitscore.com/api/scans/{scanId}

Example:

curl "https://conduitscore.com/api/scans/SCAN_ID_HERE" \
  -H "x-api-key: YOUR_API_KEY"
This is implemented in route.ts.

How auth works
For paid API access, send either:

x-api-key: YOUR_API_KEY
Authorization: Bearer YOUR_API_KEY
That logic is in api-auth.ts.

Best non-technical summary

For a simple public lookup, use: GET /api/public/domain/{domain}/score
For real paid API usage, use: POST /api/scan