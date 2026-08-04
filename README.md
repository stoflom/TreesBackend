# SA Trees Backend API

This backend application assumes a **MongoDB** database is available, as originally created by project [SARTrees](../../SARTrees).

This project was originally based on the tutorial [Using TypeScript with MongoDB](https://medium.com/swlh/using-typescript-with-mongodb-393caf7adfef).

## Getting Started

### Prerequisites

- Node.js & Yarn
- MongoDB

### Running the Application

```bash
# Create dummy data
yarn script createDummyData

# Start the server
yarn start

# With debug logging
DEBUG=express:* yarn start
```

## API Routes

### API Tests

A suite of API tests ensures all endpoints are functioning correctly.

```bash
cd test
./test_api.sh
```

> Ensure the backend server is running (`yarn start`) before executing the tests.

### Examples

> All examples pipe through `jq '.'` for pretty-printed output.

```bash
# Find all "adenias"
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/treegenus/adenia | jq '.'

# Find all variants of "acacia karroo"
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/treegs/acacia/karroo | jq '.'

# Find details of a single tree by MongoDB _id
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/id/5fae3c24cd7252082772bdee | jq '.'

# Query JSON passthrough to MongoDB (must use -X GET, default is POST for JSON)
# This currently returns the genus name and species name only
curl -X GET -H "Content-Type: application/json" -d '{"genus.name": "Adenia", "species.name": "fruticosa" }' localhost:5002/api/treesjq | jq '.'

curl -X GET -H "Content-Type: application/json" -d '{"_id": "5fae3c24cd7252082772bdee"}' localhost:5002/api/treesjq | jq '.'

# Find common name matching regex
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '.'

# Find scientific species name matching regex
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/sname/ataxa | jq '.'

# Filter output with jq — print only common names of trees
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '.[].cnames[0].names[0]'

# Or using JSON, e.g.
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '{FSA: .[].FSAnumber, cnames: .[].cnames[0]}'

# FSAnumbers and Afrikaans common names
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '{FSA: .[].FSAnumber, cnames: .[].cnames[] | select(.language=="Afr")}'

# More complete
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '{FSA: .[].FSAnumber, genus: .[].genus.name, species: .[].species.name, cnames: .[].cnames[] | select(.language=="Afr")}'

# Find trees in group 8
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/group/8 | jq '.' | grep identity

# Find genus adenia in genuscols
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/genus/adenia | jq '.'

# Find family acanthaceae in familycols
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/family/acanthaceae | jq '.'
```
