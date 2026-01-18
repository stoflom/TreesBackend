#!/bin/bash
set -e

echo "--- Running API tests ---"

echo "Testing: find all 'adenias'"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/treegenus/adenia | jq '.'

echo "Testing: find all variants of 'acacia karroo'"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/treegs/acacia/karroo | jq '.'

echo "Testing: find details of a single tree by MongoDB _id"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/id/622a132e4953a86709cb9635

echo "Testing: query JSON passthrough to MongoDB (genus and species)"
curl -s -X GET -H "Content-Type: application/json" -d '{"genus.name": "Adenia", "species.name": "fruticosa" }' localhost:5002/api/treesjq | jq '.'

echo "Testing: query JSON passthrough to MongoDB (_id)"
curl -s -X GET -H "Content-Type: application/json" -d '{ "_id" : "622a132e4953a86709cb9635"}' localhost:5002/api/treesjq | jq '.'

echo "Testing: find common name matching regex"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/cname/.*kameel.*

echo "Testing: find scientific species name matching regex"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/sname/ataxa

echo "Testing: find common names and filter with jq"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/cname/.*kameel.* | jq '.[].cnames[0].names[0]'

echo "Testing: find FSA numbers and common names with jq"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/cname/.*kameel.* | jq '{FSA: .[].FSAnumber, cnames: .[].cnames[0]}'

echo "Testing: find FSA numbers and Afrikaans common names with jq"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/cname/.*kameel.* | jq '{FSA: .[].FSAnumber, cnames: .[].cnames[] | select(.language=="Afr")}'

echo "Testing: find more complete data with jq"
curl -s -H "application/x-www-form-urlencoded" localhost:5002/api/cname/.*kameel.* | jq '{FSA: .[].FSAnumber, genus: .[].genus.name, species:  .[].species.name, cnames: .[].cnames[] | select(.language=="Afr")}'

echo "Testing: find trees in group 8"
curl -s -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/group/8 | jq '.' | grep identity

echo "Testing: find genus adenia in genuscols"
curl -s -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/genus/name/adenia | jq '.'

echo "Testing: find family acanthaceae in familycols"
curl -s -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/family/acanthaceae | jq '.'

echo "Testing: find genus with regex Acac.*"
curl -s -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/genus/regex/Acac.* | jq '.'

echo "--- All tests finished ---"
