import { Router, Request, Response } from 'express';
import { TreeModel } from '../database/trees/trees.model';
import { ITreeDocument } from '../database/trees/trees.types';
import { GenusModel } from '../database/genus/genus.model';
import { IGenusDocument } from '../database/genus/genus.types';
import { FamilyModel } from '../database/family/family.model';
import { IFamilyDocument } from '../database/family/family.types';



export const theRouter = Router();


//Most of these will only return the Id and Tree base name fields (genus, species, subspecies, variety -names)

//Test: curl -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/treegenus/adenia | jq '.' (pretty print pipe)
theRouter.get('/api/treegenus/:name', [], async (req: Request, res: Response) => {
  const trees: ITreeDocument[] = await TreeModel.findByGenusName(
    req.params.name
  );
  return res.status(200).json(trees);
});

//Test: curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/cname/wag\.\*bietjie | jq '.' (pretty print pipe)
theRouter.get(
  '/api/cname/:regex',
  [],
  async (req: Request, res: Response) => {
    const trees: ITreeDocument[] = await TreeModel.findByCommonNameRegex(
      req.params.regex
    );
    return res.status(200).json(trees);
  }
);

//test: curl -X GET  localhost:5002/api/cnlan/Afr/vlam | jq '.'   //Any Afr name must contain 'vlam'
// curl -X GET  'localhost:5002/api/cnlan/Afr/klimop$' | jq '.'   //Any Afr name end with 'klimop'
// curl -X GET  localhost:5002/api/cnlan/Afr/^bos | jq '.'        //Any Afr name starts with 'bos'
// curl -X GET  localhost:5002/api/cnlan/Afr/^\\*gif | jq '.'     //Any Afr name starts with '*bos'
// curl -X GET  'localhost:5002/api/cnlan/Afr/^\**rooi' | jq '.'  //Any Afr name starts with 'rooi' or '*rooi'
// curl -X GET  localhost:5002/api/cnlan/Afr/^\\*\*rooi | jq '.'  //same as above
//will return all names but only for the specified language
theRouter.get(
  '/api/cnlan/:language/:regex',
  [],
  async (req: Request, res: Response) => {
    const trees: ITreeDocument[] =
      await TreeModel.findByCommonNameLanguageRegex(
        req.params.language,
        req.params.regex
      );
    return res.status(200).json(trees);
  }
);

//Test: curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/sname/ataxa | jq '.' (pretty print pipe)
theRouter.get(
  '/api/sname/:regex',
  [],
  async (req: Request, res: Response) => {
    const trees: ITreeDocument[] = await TreeModel.findBySpeciesNameRegex(
      req.params.regex
    );
    return res.status(200).json(trees);
  }
);

//Test: curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/treegs/acacia/karroo | jq '.' (pretty print pipe)
theRouter.get(
  '/api/treegs/:gname/:sname',
  [],
  async (req: Request, res: Response) => {
    const trees: ITreeDocument[] = await TreeModel.findByGenusSpeciesNames(
      req.params.gname,
      req.params.sname
    );
    return res.status(200).json(trees);
  }
);

//Test: curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/id/5fae3c24cd7252082772bdee | jq '.' (pretty print pipe)
theRouter.get('/api/id/:id', [], async (req: Request, res: Response) => {
  //findByID is provided by mongoose, as is find
  const tree: ITreeDocument = await TreeModel.findById(req.params.id);
  return res.status(200).json(tree);
});

//Test: curl -X GET -H  "Content-Type: application/json"  -d  '{"genus.name": "Adenia" }' localhost:5002/api/treesjq | jq '.' (pretty print pipe)
// curl -X GET -H  "Content-Type: application/json"  -d  '{ "_id" : "5fae3c24cd7252082772bdee"}' localhost:5002/api/treesjq | jq '.'
//  the query object is passed directly to MongoDB but cannot include e.g. /regex/
theRouter.get('/api/treesjq/', [], async (req: Request, res: Response) => {
  const trees: ITreeDocument[] = await TreeModel.find(req.body).select({
    'species.name': 1,
    'genus.name': 1,
  });
  return res.status(200).json(trees);
});

//Test: curl -X GET  localhost:5002/api/trees?genus.name=Adenia | jq '.'
//curl -X GET  localhost:5002/api/trees?genus.name=Adenia\&species.name=gummifera | jq '.'
theRouter.get('/api/trees/', [], async (req: Request, res: Response) => {
  const trees: ITreeDocument[] = await TreeModel.find(req.query).select({
    'species.name': 1,
    'genus.name': 1,
  });
  return res.status(200).json(trees);
});

//Test: curl -H "Content-Type: application/x-www-form-urlencoded" localhost:5002/api/group/41 | jq '.' (pretty print pipe)
theRouter.get(
  '/api/group/:group',
  [],
  async (req: Request, res: Response) => {
    const trees: ITreeDocument[] = await TreeModel.findByGroup(
      req.params.group
    );
    return res.status(200).json(trees);
  }
);



//Test: curl -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/genus/adenia | jq '.' (pretty print pipe)
theRouter.get('/api/genus/:name', [], async (req: Request, res: Response) => {
  const genus: IGenusDocument[] = await GenusModel.findByGenusName(
    req.params.name
  );
  return res.status(200).json(genus);
});


//Test: curl -H "Content-Type:application/x-www-form-urlencoded" localhost:5002/api/family/Anacardiaceae | jq '.' (pretty print pipe)
theRouter.get('/api/family/:name', [], async (req: Request, res: Response) => {
  const genus: IFamilyDocument[] = await FamilyModel.findByFamilyName(
    req.params.name
  );
  return res.status(200).json(genus);
});

/*
// Test: curl -X POST -H  "Content-Type: application/json"  -d  '{"title": "hi", "description": "hallo"}' localhost:3000/api/todo
todoRouter.post("/api/todo", async (req, res) => {
  const { title, description } = req.body;
  const todo = Todo.build({ title, description });

  await todo.save();
  return res.status(201).send(todo);
});
*/
