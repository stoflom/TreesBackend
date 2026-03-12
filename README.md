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
  - [Advanced Queries](#advanced-queries)
- [Testing](#-testing)
- [Notes](#-notes)

---

## 🛠 Prerequisites

- **Deno** (v2.x recommended)
- **MongoDB** (A running instance with the tree data)
- **jq** (Optional, for formatting JSON output in tests)

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
| **Dummy Data**| `deno run --allow-all src/scripts/createDummyData.ts` | Generates sample data |

---

## 📖 API Documentation

The server defaults to port `5002`. Most endpoints expect `application/x-www-form-urlencoded` or `application/json`.

### Tree Search

| Description | Endpoint / Example |
| :--- | :--- |
| **By Genus** | `GET /api/treegenus/:genus` |
| Example | `curl http://localhost:5002/api/treegenus/adenia | jq '.'` |
| **By Genus & Species** | `GET /api/treegs/:genus/:species` |
| Example | `curl http://localhost:5002/api/treegs/acacia/karroo | jq '.'` |
| **By ID** | `GET /api/id/:id` |
| Example | `curl http://localhost:5002/api/id/5fae3c24cd7252082772bdee | jq '.'` |
| **By Common Name (Regex)** | `GET /api/cname/:regex` |
| Example | `curl http://localhost:5002/api/cname/wag.*bietjie | jq '.'` |
| **By Scientific Name (Regex)** | `GET /api/sname/:regex` |
| Example | `curl http://localhost:5002/api/sname/ataxa | jq '.'` |

### Genus & Family Search

| Description | Endpoint / Example |
| :--- | :--- |
| **Genus Lookup** | `GET /api/genus/:genus` |
| Example | `curl http://localhost:5002/api/genus/adenia | jq '.'` |
| **Genus Regex** | `GET /api/genus/regex/:regex` |
| Example | `curl http://localhost:5002/api/genus/regex/^ad | jq '.'` |
| **Family Lookup** | `GET /api/family/:family` |
| Example | `curl http://localhost:5002/api/family/acanthaceae | jq '.'` |

### Advanced Queries

- **JSON Passthrough:** Send a MongoDB query object directly.
  ```bash
  curl -X GET -H "Content-Type: application/json" \
    -d '{"genus.name": "Adenia", "species.name": "fruticosa"}' \
    http://localhost:5002/api/treesjq | jq '.'
  ```

- **Filtering with `jq`:**
  ```bash
  # Print only FSA numbers and Afrikaans names
  curl http://localhost:5002/api/cname/wag.*bietjie | \
    jq '{FSA: .[].FSAnumber, cnames: .[].cnames[] | select(.language=="Afr")}'
  ```

---

## 🧪 Testing

A suite of API tests is available in the `test/` directory.

```bash
cd test
./test_api.sh
```

The script executes the documented `curl` commands and outputs JSON results, which can be formatted with `jq`.

---

## 📝 Notes

- **CORS:** The server is configured to allow Cross-Origin Resource Sharing.
- **Port:** Default port is `5002`.
- **Database:** Ensure your MongoDB instance is accessible and the firewall allows connections on the specified port.

---

Contributions and fixes are welcome. Please open issues or PRs on GitHub.
