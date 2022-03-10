# SA trees backend api

# This backend application assumes a MongDB database is available as originally created by project
# SARTrees (repository ../../SARTrees).

This project was orihinally based on tutorial: Using TypeScript with MongoDB.
https://medium.com/swlh/using-typescript-with-mongodb-393caf7adfef

To create tree entries in db do: 
    yarn script createDummyData

To run main (test.ts) do:
    yarn script test

To start the server do:
    yarn start

To get debug logging do:
    DEBUG=express:*  yarn start


# EXAMPLES of use:
# ROUTES: (To pretty print pipe response through jq: " | jq '.' ")

# find all "adenias"
curl -H "application/x-www-form-urlencoded" localhost:5002/api/treegenus/adenia  | jq '.'

# find all variants of "acacia karroo"
curl -H "application/x-www-form-urlencoded" localhost:5002/api/treegs/acacia/karroo  | jq '.'

# find details of a single tree by MongoDB _id:
curl -H "application/x-www-form-urlencoded" localhost:5002/api/id/5fae3c24cd7252082772bdee 

# query JSON passthrough to MongoDB (must use -X GET, default is POST for json) (This currently returns the genus name and species name only)
curl -X GET -H  "Content-Type: application/json"  -d  '{"genus.name": "Adenia", "species.name": "fruticosa" }'   localhost:5002/api/trees2 | jq '.'

curl -X GET -H  "Content-Type: application/json"  -d  '{ "_id" : "5fae3c24cd7252082772bdee"}' localhost:5002/api/trees2 | jq '.'

# find common name matching regex
curl -H "application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie

# find scientific species name matching regex
curl -H "application/x-www-form-urlencoded" localhost:5002/api/sname/ataxa 

# Can use jq pipe to further filter output, e.g. print only common names of trees
curl -H "application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '.[].cnames[0].names[0]'
# or using JSON, e.g.
curl -H "application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '{FSA: .[].FSAnumber, cnames: .[].cnames[0]}'
# FSAnumbers and Afr common names
url -H "application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '{FSA: .[].FSAnumber, cnames: .[].cnames[] | select(.language=="Afr")}'
# more complete
curl -H "application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '{FSA: .[].FSAnumber, genus: .[].genus.name, species:  .[].species.name, cnames: .[].cnames[] | select(.language=="Afr")}'

# find trees in group 8
curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/group/8 | jq '.' | grep scientificName

# find genus adenia in genuscols
curl -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/genus/adenia | jq '.'

# find family acanthaceae in familycols
curl -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/family/acanthaceae | jq '.'