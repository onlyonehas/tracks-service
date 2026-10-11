# Tracks API

The API is JSON over HTTP. The examples below use <http://localhost:3000>.
Request bodies must be sent with `Content-Type: application/json`.

A track looks like this:

```json
{
  "type": "track",
  "id": "nznx3r",
  "urn": "urn:bbc:sounds:track:nznx3r",
  "titles": {
    "primary": "AC/DC",
    "secondary": "Highway to Hell",
    "tertiary": null
  },
  "availability": {
    "from": "2019-02-13T11:03:05Z",
    "to": "2019-03-15T11:00:00Z",
    "label": "Available for 29 days"
  }
}
```

## Add a track

```sh
POST /tracks
```

```sh
curl -X POST http://localhost:3000/tracks \
  -H 'Content-Type: application/json' \
  -d @test/fixtures/highway-to-hell.json
```

Responses:

- `201 Created` with the stored track and a `Location` header.
- `400 Bad Request` with `{ "error": "..." }` when a required field is missing
  or the body is not valid JSON.

Posting the same `id` again updates the stored track.

## Fetch a track by id

```sh
GET /tracks/:id
```

Responses:

- `200 OK` with the track.
- `404 Not Found` with `{ "error": "Track not found" }` when no track has that
  id.

## List tracks

```sh
GET /tracks
```

Responses:

- `200 OK` with `{ "tracks": [ ... ] }`, empty until tracks are added.

## Assumptions

- `id` is the unique key. Posting an existing `id` updates that track.
- The service is in memory, so tracks are lost when it restarts.
- Requests must send JSON with `Content-Type: application/json`.
- `titles.secondary` and `titles.tertiary` are optional.
- The required fields are checked: `type`, `id`, `urn`, `titles.primary` and
  the three `availability` fields. Field formats are not validated.
- Unknown fields are ignored.
- There is no authentication, pagination or persistence.
