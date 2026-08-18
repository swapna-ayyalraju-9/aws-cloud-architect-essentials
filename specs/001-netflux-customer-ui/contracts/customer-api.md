# Contract: Customer API

Consumed by the Netflux customer UI. Breaking changes require a spec update.

## GET `/api/customers/{id}`

Returns the customer profile and recommended movies for the current favorite genre.

**Success**: `200 OK`

```json
{
  "id": 1,
  "name": "string",
  "favoriteGenre": "ACTION | COMEDY | CRIME | DRAMA",
  "recommendedMovies": [
    {
      "id": 1,
      "title": "string",
      "releaseYear": 1999,
      "genre": "ACTION | COMEDY | CRIME | DRAMA"
    }
  ]
}
```

**Not found**: customer-service maps unknown ids to the UI not-found state. Do not change this into a silent empty profile.

## PATCH `/api/customers/{id}/genre`

Updates the customer's favorite genre.

**Request**:

```json
{
  "favoriteGenre": "ACTION | COMEDY | CRIME | DRAMA"
}
```

**Success**: `204 No Content`

The UI reloads `GET /api/customers/{id}` after a successful patch.
