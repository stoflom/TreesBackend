# SA Trees Backend API

This repository contains the backend API for the South African Trees project. It's a Node.js + TypeScript + Express + Mongoose application that expects a MongoDB database (originally populated by the SARTrees project).

This project was originally based on the tutorial "Using TypeScript with MongoDB":
https://medium.com/swlh/using-typescript-with-mongodb-393caf7adfef

Prerequisites
- Node.js (16+ recommended)
- Typescript
- Yarn 4
- Express
- Mongoose
- jq (for making pretty output of tests with *| jq '.'*)

## Database

A running MongoDB instance populated with tree data (the data is currently not in public domain.)
The schema and sample collections are in subdirectory *MongoDB/*.


## Scripts

Common scripts
- Create dummy data in the database: (this may not be fully up to date, refer Database above)
    `yarn script createDummyData`

- Run the main test script (test.ts only tests MongoDB driver.):
    `yarn script test`

- Start the server:
    `yarn start`

- Enable debug logging for Express:
    `DEBUG=express:* yarn start`

## Tests
    
A suite of API test examples have been created (the curl commands from this README extracted into a script). The output will be in json format which can be pretty printed or filtered by piping through the *jq* filter.

To run the API tests:

```bash
cd test
./test_api.sh
```

Check the results manually.

### Examples (see file routes.ts)

Notes: 
   - many endpoints expect *form-urlencoded* content. Where appropriate the *Content-Type* header is shown.
   - MongoDB uses Perl regular expressions, case is ignored during matching.

   
1. Find all "Adenia" trees entries by genus:
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/treegenus/adenia | jq '.'`

  
2. Find all variants of "Acacia karroo":
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/treegs/acacia/karroo | jq '.'`

  
3. Find a tree by MongoDB *_id:*  (use a valid id from previous query)
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/id/5fae3c24cd7252082772bdee | jq '.'`

  
4. Query JSON passthrough to MongoDB (use GET for queries; this endpoint returns limited fields):
  `curl -X GET -H "Content-Type: application/json" -d '{"genus.name": "Adenia", "species.name": "fruticosa" }' http://localhost:5002/api/treesjq | jq '.' `

  `curl -X GET -H "Content-Type: application/json" -d '{"_id":"5fae3c24cd7252082772bdee"}' http://localhost:5002/api/treesjq | jq '.'`

  
5. Find common name matching regex:
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/cname/wag.*bietjie | jq '.'`

  
6. Find scientific species name matching regex:
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/sname/ataxa | jq '.'`

  
7. Example to uses `jq` to print only common names of trees:
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/cname/wag.*bietjie | jq '.[].cnames[0].names[0]'`

  
8. Print FSA numbers and Afrikaans common names:
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/cname/wag.*bietjie | jq '{FSA: .[].FSAnumber, cnames: .[].cnames[] | select(.language=="Afr")} `

  
9. Find trees in group 8 (B v Wyk, P v Wyk, How to Identify Trees in SA, Struik, 2007, ISBN 9781770072404):
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/group/8 | jq '.' | grep identity`

  
10. Find genus "adenia" in genuscols:
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/genus/adenia | jq '.'`
  
  
11. Find genera matching "^ad" (starts with "Ad" or "ad", ".*" finds all genera):
  `curl -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/genus/regex/^ad | jq '.'`

  
12. Find family "acanthaceae" in familycols:
  `curl -H "Content-Type: application/x-www-form-urlencoded" http://localhost:5002/api/family/acanthaceae | jq '.'`

  
## Notes
- The backend server defaults to port 5002 unless configured otherwise
- The server (Express) is configured for CORS.
- If you encounter issues connecting to MongoDB, verify the connection URI and that the database is accessible from the host (firewall!) running this service.

Contributions and fixes are welcome. Please open issues or PRs on GitHub.
