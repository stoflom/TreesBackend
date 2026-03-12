# SA Trees Backend API

The backend API for the South African Trees project. Built with **Deno**, **TypeScript**, **Express**, and **Mongoose**, interfacing with a **MongoDB** database.

---

## 📋 Table of Contents
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Database Configuration](#-database-configuration)
- [Development Tasks](#-development-tasks)
- [API Documentation](#-api-documentation)
  - [Tree Search](#tree-search)
  - [Genus & Family Search](#genus--family-search)
  - [Vegetation Search](#vegetation-search)
  - [Advanced Queries](#advanced-queries)
- [Testing](#-testing)
- [Notes](#-notes)

---

## 🛠 Prerequisites

- **Deno** (v2.x recommended)
- **MongoDB** (A running instance with the tree data)
- **jq** (Recommended for formatting JSON output in terminal)

---

## 🚀 Getting Started

### 1. Install Deno
If you don't have Deno installed, run:
```bash
curl -fsSL https://deno.land/install.sh | sh
```

### 2. Cache Dependencies
```bash
deno task build
```

### 3. Start the Server
```bash
deno task dev
```

---

## 🗄 Database Configuration

The project expects a MongoDB instance populated with the `SATrees` dataset. 

> [!IMPORTANT]
> Currently, the MongoDB URI is configured in `src/database/database.ts`. You may need to update the `uri` constant to match your local or remote MongoDB instance.

Sample data and schemas can be found in the `MongoDB/` directory for reference.

---

## ⚙️ Development Tasks

Common tasks defined in `deno.json`:

| Task | Command | Description |
| :--- | :--- | :--- |
| **Start** | `deno task start` | Runs the production server |
| **Dev** | `deno task dev` | Runs the server with auto-reload |
| **Build** | `deno task build` | Caches all project dependencies |
| **Test** | `deno task test` | Executes the Deno test suite |
| **Dummy Data**| `deno run -A src/scripts/createDummyData.ts` | Generates sample data |

---

## 📖 API Documentation

The server defaults to port `5002`. Most endpoints expect `application/json` or `application/x-www-form-urlencoded`.

### Tree Search

| Description | Method | Endpoint / Example |
| :--- | :--- | :--- |
| **By Genus** | `GET` | `/api/treegenus/:name` <br> `curl http://localhost:5002/api/treegenus/adenia | jq '.'` |
| **By Genus & Species** | `GET` | `/api/treegs/:genus/:species` <br> `curl http://localhost:5002/api/treegs/acacia/karroo | jq '.'` |
| **By ID** | `GET` | `/api/id/:id` <br> `curl http://localhost:5002/api/id/5fae3c24cd7252082772bdee | jq '.'` |
| **By Group** | `GET` | `/api/group/:groupNumber` <br> `curl http://localhost:5002/api/group/41 | jq '.'` |
| **By Common Name** | `GET` | `/api/cname/:regex` <br> `curl http://localhost:5002/api/cname/wag.*bietjie | jq '.'` |
| **By Scientific Name** | `GET` | `/api/sname/:regex` <br> `curl http://localhost:5002/api/sname/ataxa | jq '.'` |
| **By Language & Name** | `GET` | `/api/cnlan/:lang/:regex` <br> `curl http://localhost:5002/api/cnlan/Afr/vlam | jq '.'` |

### Genus & Family Search

| Description | Method | Endpoint / Example |
| :--- | :--- | :--- |
| **Genus Lookup** | `GET` | `/api/genus/name/:name` <br> `curl http://localhost:5002/api/genus/name/adenia | jq '.'` |
| **Genus Regex** | `GET` | `/api/genus/regex/:regex` <br> `curl http://localhost:5002/api/genus/regex/^ad | jq '.'` |
| **Family Lookup** | `GET` | `/api/family/:name` <br> `curl http://localhost:5002/api/family/acanthaceae | jq '.'` |
| **Family Regex** | `GET` | `/api/family/regex/:regex` <br> `curl http://localhost:5002/api/family/regex/ace.* | jq '.'` |

### Vegetation Search

| Description | Method | Endpoint / Example |
| :--- | :--- | :--- |
| **By Abbreviation** | `GET` | `/api/vegetation/abbreviation/:code` <br> `curl http://localhost:5002/api/vegetation/abbreviation/FO | jq '.'` |

### Advanced Queries

- **JSON Passthrough (POST):** Send a MongoDB query object directly.
  ```bash
  curl -X POST -H "Content-Type: application/json" \
    -d '{"genus.name": "Adenia", "species.name": "fruticosa"}' \
    http://localhost:5002/api/treesjq | jq '.'
  ```

- **Query Parameters (GET):** Filter trees using query parameters.
  ```bash
  curl "http://localhost:5002/api/trees?genus.name=Adenia&species.name=gummifera" | jq '.'
  ```

---

## 🧪 Testing

The project includes a Deno-based test suite that validates API endpoints.

**Ensure the server is running (`deno task dev`) before executing tests.**

```bash
deno task test
```

You can also run the legacy shell script:
```bash
cd test
./test_api.sh
```

---

## 📝 Notes

- **CORS:** The server is configured to allow Cross-Origin Resource Sharing.
- **Port:** Default port is `5002`.
- **Database:** MongoDB URI is currently hardcoded in `src/database/database.ts`.

---

Contributions and fixes are welcome. Please open issues or PRs on GitHub.
