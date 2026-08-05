# SATrees Backend API

Deno/Express/Mongoose/MongoDB backend for the SATrees frontend application. Provides RESTful endpoints for searching Southern African tree data (1600+ species) by common name, genus, species, and more. Serves the Angular frontend statically on port **5002**.

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

# Or use the root start script (builds frontend + starts backend)
cd .. && ./start.sh
```

The server listens on port **5002** and serves the Angular frontend statically.

### 3. Populate the database (optional)

```bash
deno run -A --env-file .env src/scripts/createDummyData.ts
```

## API Endpoints

All endpoints are under `/api`. The examples below use `localhost:5002` for convenience.

### Application Version

```bash
curl http://localhost:5002/api/version
# {"version": "1.0.0"}
```

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

## Further help

- [Deno Documentation](https://docs.deno.com/)
- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
