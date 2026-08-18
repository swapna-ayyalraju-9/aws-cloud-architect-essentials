# Contract: Movie API

Consumed by the Netflux customer UI all-movies view, and internally by customer-service for recommendations.

## GET `/api/movies`

Returns the full catalog.

**Success**: `200 OK`

```json
[
  {
    "id": 1,
    "title": "string",
    "releaseYear": 1999,
    "genre": "ACTION | COMEDY | CRIME | DRAMA"
  }
]
```

## GET `/api/movies/{genre}`

Returns movies for one genre. Used by customer-service when building recommendations. Genre path values are `ACTION`, `COMEDY`, `CRIME`, or `DRAMA`.
