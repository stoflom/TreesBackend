# SATrees Backend API

Node.js/Express/Mongoose/MongoDB backend for the SATrees frontend application. Provides RESTful endpoints for searching Southern African tree data (1600+ species) by common name, genus, species, and more.

## Prerequisites

- [Deno](https://deno.com/) (latest stable)
- [MongoDB](https://www.mongodb.com/) (running locally or remote)

## Setup

### 1. Configure the database

Create a `.env` file in the project root:

```bash
MONGODB_URI=mongodb://192.168.0.8:27017/SATrees
```

The `.env` file is gitignored. The default fallback (if `.env` is missing) is `mongodb://localhost:27017/SATrees`.

### 2. Start the server

```bash
# Development mode (with file watcher)
deno task dev

# Production mode
deno task start
```

The server listens on port **5002**.

### 3. Populate the database (optional)

```bash
deno run -A --env-file .env src/scripts/createDummyData.ts
```

## API Endpoints

All endpoints are under `/api`. The examples below use `localhost:5002` for convenience.

> **⚠️ Important: Frontend connection requires an IP address or hostname**
>
> The backend's CORS configuration rejects requests from `localhost`. This means the
> **frontend application** (Angular) cannot connect to the backend via `localhost`.
> It must use an IP address or hostname instead (e.g., `192.168.0.8:5002` or
> `fedora-msi:5002`).
>
> The `curl` examples below work with `localhost` because they are not subject to
> browser CORS restrictions. Replace `localhost` with your backend address when
> configuring the frontend in `src/environments/environment.ts`.

### Search trees by genus

```bash
# Find all trees in genus "Adenia"
curl -H "Content-Type: application/x-www-form-urlencoded" \
  http://localhost:5002/api/treegenus/adenia | jq '.'

# Find all variants of "Acacia karroo"
curl -H "Content-Type: application/x-www-form-urlencoded" \
  http://localhost:5002/api/treegs/acacia/karroo | jq '.'
```

### Search by ID

```bash
# Find a single tree by MongoDB _id
curl -H "Content-Type: application/x-www-form-urlencoded" \
  http://localhost:5002/api/id/5fae3c24cd7252082772bdee | jq '.'
```

### Query with JSON (GET)

Pass a JSON query object to match against the database:

```bash
curl -X GET -H "Content-Type: application/json" \
  -d '{"genus.name": "Adenia", "species.name": "fruticosa"}' \
  http://localhost:5002/api/treesjq | jq '.'
```

### Search common names (regex)

```bash
# Find common names matching a regex pattern
curl -H "Content-Type: application/x-www-form-urlencoded" \
  http://localhost:5002/api/cname/wag\.\*bietjie | jq '.'

# Filter output — print only Afrikaans common names
curl -H "Content-Type: application/x-www-form-urlencoded" \
  http://localhost:5002/api/cname/wag\.\*bietjie | \
  jq '{FSA: .[].FSAnumber, genus: .[].genus.name, species: .[].species.name, cnames: .[].cnames[] | select(.language=="Afr")}'
```

### Search genus and family

```bash
# Find genus by name
curl -H "Content-Type: application/x-www-form-urlencoded" \
  http://localhost:5002/api/genus/adenia | jq '.'

# Find family by name
curl -H "Content-Type: application/x-www-form-urlencoded" \
  http://localhost:5002/api/family/acanthaceae | jq '.'
```

### Filter groups

```bash
# Find trees in group 8
curl -H "Content-Type: application/x-www-form-urlencoded" \
  http://localhost:5002/api/group/8 | jq '.[].identity'
```

## Running tests

```bash
deno task test
```

Requires the server to be running (`deno task dev` or `deno task start`) before executing tests.

## Project structure

```
src/
├── database/          # Mongoose models and connection
│   ├── database.ts    # DB connection (reads MONGODB_URI from env)
│   ├── tree/          # Tree model
│   ├── genus/         # Genus model
│   └── vegetation/    # Vegetation model
├── routes/            # Express route handlers
├── scripts/           # Utility scripts (e.g. createDummyData)
└── server.ts          # Express app entry point
```

## CORS

CORS is enabled on the Express server, but the configuration **rejects `localhost`** as an allowed origin.

This means:
- The **frontend** (Angular app) must connect to the backend using an IP address or hostname (e.g., `192.168.0.8:5002` or `fedora-msi:5002`)
- Set the backend URL in `src/environments/environment.ts` accordingly
- The `curl` examples in this README work with `localhost` because they bypass browser CORS restrictions

If you need to change the CORS configuration, modify the `cors()` options in `src/server.ts`.

## Further help

- [Deno Documentation](https://docs.deno.com/)
- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
