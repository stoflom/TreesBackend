//import { getUnpackedSettings } from 'http2';
import { ITree, ITreeDocument, ITreeModel } from './tree.types';


export async function findOneOrCreate(
  //  this: ITreeModel, //Dummy for invoking findOne method
  Tree: ITree
): Promise<ITreeDocument> {
  const record = await this.findOne(Tree); //Find one returns the first match NB!
  if (record) {
    return record;
  } else {
    return this.create(Tree);
  }
}

//Returns array
export async function findByGenusName(
  genusname: string
): Promise<ITreeDocument[]> {
  return this.aggregate([
    {
      $match: { 'genus.name': genusname }
    }, {
      $project: {  //Must first get all data needed by virtuals
        genus: 1,
        species: 1,
        subspecies: 1,
        variety: 1,
        cnamesE: {
          $arrayElemAt: [
            '$cnames',
            {
              $indexOfArray: [
                '$cnames.language',
                "Eng"
              ]
            },
          ]
        },
        cnamesA: {
          $arrayElemAt: [
            '$cnames',
            {
              $indexOfArray: [
                '$cnames.language',
                "Afr"
              ]
            },
          ]
        },
      }
    }, {
      $addFields: {
        firstname: {
          $concat: [ //Need a firstname for display
            {
              $arrayElemAt: [
                '$cnamesE.names', 0
              ]
            },
            "/",
            {
              $arrayElemAt: [
                '$cnamesA.names', 0
              ]
            }

          ]
        },
        identity: {       //Also need identity, add virtual manually sonce mongoos won't for aggregates.
          $trim: {
            input: {
              $concat: ["$genus.name", " ", "$species.name",
                { $cond: ["$subspecies", { $concat: [" subsp.", "$subspecies.name"] }, ""] },
                { $cond: ["$variety", { $concat: [" var. ", "$variety.name"] }, ""] }
              ]
            }
          }
        },
        id: "$_id"  //add id virtual manually sonce mongoos won't for aggregates.
      }
    }, {
      $project: {  //Return only virtuals
        genus: 0,
        species: 0,
        subspecies: 0,
        variety: 0,
        cnames: 0,
        cnamesE: 0,
        cnamesA: 0
      }
    }
  ]).sort('identity');
}


//ALSO Lookup genus from genuscols to get family
//NOTE see commented function below which uses .populate
export async function findByGenusSpeciesNames(
  genusname: string,
  speciesname: string
): Promise<ITreeDocument[]> {  //NOTE returns more than defined in ITreeDocument, must fix there
  // probably by extending ITreeDocument to include IGenusDocument etc.
  return this.aggregate([
    {
      $match: {
        'genus.name': genusname,
        'species.name': speciesname,
      }
    },
    {
      $lookup: {
        from: 'genuscols',
        localField: 'genus.fref',
        foreignField: '_id',
        as: 'genus'               //overwrite genus with full def from genuscols.
      }
    },
    {
      $addFields: {
        genus: { '$arrayElemAt': ['$genus', 0] },     //overwrite genus again to first elem. in array
        family: { '$arrayElemAt': ['$genus.family', 0] },
        identity: {       //Also need identity, add virtual manually sonce mongoos won't for aggregates.
          $trim: {
            input: {
              $concat: [{ '$arrayElemAt': ['$genus.name', 0] }, " ", "$species.name", " ",
              { $ifNull: ["$subspecies.name", "$variety.name", " "] }
              ]
            }
          }
        },
        id: "$_id"  //add id virtual manually since mongoos won't for aggregates.
      }
    },
    // { $project: {
    //   }
    // }
  ]).sort('Identity');
}

// // Below is supposed to work but returns error:  GenusSchema not registered//
// //Returns array
// export async function findByGenusSpeciesNames(
//   genusname: string,
//   speciesname: string
// ): Promise<ITreeDocument[]> {
//   return this.find({
//     'genus.name': genusname,
//     'species.name': speciesname,
//   }).select({
//     'genus.name': 1,
//  //   'genus.fref.name':1,
// //    'genus':1,
//     'species.name': 1,
//     'subspecies.name': 1,
//     'variety.name': 1,
//     'firstname': 1,
//     'group': 1
//   }).populate('genus.fref');
// }

//Returns array
export async function findByCommonNameRegex(
  regex: string
): Promise<ITreeDocument[]> {
  return this.find({ 'cnames.names': { $regex: regex, $options: 'i' } }).select(
    {//Only returns _id, fields for virtuals
      'genus.name': 1,
      'genus.authority': 1,
      'species.name': 1,
      'species.authority': 1,
      'subspecies.name': 1,
      'subspecies.authority': 1,
      'variety.name': 1,
      'variety.authority': 1,
      // 'group': 1,
      'cnames': 1   //Only language searched
    }
  ).sort('genus.name species.name subspecies.name variety.name');
}

//Note: aggregates return random jason and mongoos will not add
// virtual variables by itself, they must be added manually.
export async function findByCommonNameLanguageRegex(
  language: string,
  regex: string
): Promise<ITreeDocument[]> {  //NOTE return agrees with ITreeDocument (I think)
  return this.aggregate(
    [{    //Only interested in trees where this language exists
      $match: {
        'cnames.language': language,
      }
    }, {
      $project: {   //Only interested in these language entries
        'genus.name': 1,
        'species.name': 1,
        'subspecies.name': 1,
        'variety.name': 1,
        anames: {   //introduce new field with only the nanames in the language
          $arrayElemAt: [
            '$cnames.names',
            {
              $indexOfArray: [
                '$cnames.language',
                language
              ]
            }
          ]
        }
      }
    },
    { //Now get only the trees where the regex matches
      $match: {
        "anames": { $elemMatch: { $regex: regex, $options: 'i' } }
      }
    },
    {
      $addFields: {
        firstname: {      //Need a firstname for display
          $arrayElemAt: [
            '$anames', 0  //This should rather return the matching name...
          ]
        },
        identity: {       //Also need identity, add virtual manually sonce mongoos won't for aggregates.
          $trim: {
            input: {
              $concat: ["$genus.name", " ", "$species.name",
                { $cond: ["$subspecies", { $concat: [" subsp.", "$subspecies.name"] }, ""] },
                { $cond: ["$variety", { $concat: [" var. ", "$variety.name"] }, ""] }
              ]
            }
          }
        },
        id: "$_id"  //add id virtual manually sonce mongoos won't for aggregates.
      }
    },
    {
      $project: {
        cnames: 0
      }
    }
    ]
  ).sort('Identity');
}

//Returns array
export async function findBySpeciesNameRegex(
  regex: string
): Promise<ITreeDocument[]> {
  return this.find({ 'species.name': { $regex: regex, $options: 'i' } }).select(
    {
      'genus.name': 1,
      'species.name': 1,
      'subspecies.name': 1,
      'variety.name': 1,
      'firstname': 1,
      'group': 1
    }
  ).sort('genus.name species.name subspecies.name variety.name');
}

//Returns array
export async function findByGroup(
  group: string
): Promise<ITreeDocument[]> {
  return this.aggregate([
    {
      $match: { 'group': group }
    }, {
      $project: {  //Must first get all data needed by virtuals
        genus: 1,
        species: 1,
        subspecies: 1,
        variety: 1,
        cnamesE: {
          $arrayElemAt: [
            '$cnames',
            {
              $indexOfArray: [
                '$cnames.language',
                "Eng"
              ]
            },
          ]
        },
        cnamesA: {
          $arrayElemAt: [
            '$cnames',
            {
              $indexOfArray: [
                '$cnames.language',
                "Afr"
              ]
            },
          ]
        },
      }
    }, {
      $addFields: {
        firstname: {
          $concat: [ //Need a firstname for display
            {
              $arrayElemAt: [
                '$cnamesE.names', 0
              ]
            },
            "/",
            {
              $arrayElemAt: [
                '$cnamesA.names', 0
              ]
            }

          ]
        },
        identity: {       //Also need identity, add virtual manually sonce mongoos won't for aggregates.
          $trim: {
            input: {
              $concat: ["$genus.name", " ", "$species.name",
                { $cond: ["$subspecies", { $concat: [" subsp.", "$subspecies.name"] }, ""] },
                { $cond: ["$variety", { $concat: [" var. ", "$variety.name"] }, ""] }
              ]
            }
          }
        },
        id: "$_id"  //add id virtual manually sonce mongoos won't for aggregates.
      }
    }, {
      $project: {  //Return only virtuals
        genus: 0,
        species: 0,
        subspecies: 0,
        variety: 0,
        cnames: 0,
        cnamesE: 0,
        cnamesA: 0
      }
    }
  ]).sort('identity');
}

