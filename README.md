# SA Trees Backend API

This repository contains the backend API for the South African Trees project. It's a Node.js + TypeScript + Express application that expects a MongoDB database (originally populated by the SARTrees project).

This project was originally based on the tutorial "Using TypeScript with MongoDB":
https://medium.com/swlh/using-typescript-with-mongodb-393caf7adfef

Prerequisites
- Node.js (16+ recommended)
- yarn
- A running MongoDB instance populated with tree data

Common scripts
- Create dummy data in the database:
    yarn script createDummyData

- Run the main test script (test.ts):
    yarn script test

- Start the server:
    yarn start

- Enable debug logging for Express:
    DEBUG=express:* yarn start

API tests
A suite of API tests has been created (the curl commands from this README extracted into a script).
To run the API tests:

```bash
cd test
./test_api.sh
```

Ensure the backend server is running (yarn start) before executing the tests.

Examples
Note: many endpoints expect form-urlencoded content. Where appropriate the Content-Type header is shown.

- Find all "Adenia" entries by genus:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/treegenus/adenia | jq '.'

- Find all variants of "Acacia karroo":
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/treegs/acacia/karroo | jq '.'

- Find a tree by MongoDB _id:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/id/5fae3c24cd7252082772bdee

- Query JSON passthrough to MongoDB (use GET for queries; this endpoint returns limited fields):
  curl -X GET -H "Content-Type: application/json" -d '{"genus.name": "Adenia", "species.name": "fruticosa" }' http://localhost:5002/api/treesjq | jq '.'

  curl -X GET -H "Content-Type: application/json" -d '{"_id":"5fae3c24cd7252082772bdee"}' http://localhost:5002/api/treesjq | jq '.'

- Find common name matching regex:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/cname/wag\.*bietjie | jq '.'

- Find scientific species name matching regex:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/sname/ataxa | jq '.'

- Example: print only common names of trees:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/cname/wag\.*bietjie | jq '.[].cnames[0].names[0]'

- Print FSA numbers and Afrikaans common names:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/cname/wag\.*bietjie | jq '{FSA: .[].FSAnumber, cnames: .[].cnames[] | select(.language=="Afr")} '

- Find trees in group 8:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/group/8 | jq '.' | grep identity

- Find genus "adenia" in genuscols:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/genus/adenia | jq '.'

- Find family "acanthaceae" in familycols:
  curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/family/acanthaceae | jq '.'

Notes
- The server defaults to port 5002 unless configured otherwise.
- If you encounter issues connecting to MongoDB, verify the connection URI and that the database is accessible from the host running this service.

Contributing
Contributions and fixes are welcome. Please open issues or PRs on GitHub.
