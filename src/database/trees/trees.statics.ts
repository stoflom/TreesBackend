import { getUnpackedSettings } from 'http2';
import { ITree, ITreeDocument, ITreeModel } from './trees.types';

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
  //  this: ITreeModel,
  genusname: string
): Promise<ITreeDocument[]> {
  return this.find({ 'genus.name': genusname }).select({
    'genus.name': 1,
    'species.name': 1,
    'subspecies.name': 1,
    'variety.name': 1,
    'firstname': 1,
    'group': 1
  });
}

//Returns array
export async function findByGenusSpeciesNames(
  //  this: ITreeModel,
  genusname: string,
  speciesname: string
): Promise<ITreeDocument[]> {
  return this.find({
    'genus.name': genusname,
    'species.name': speciesname,
  }).select({
    'genus.name': 1,
    'species.name': 1,
    'subspecies.name': 1,
    'variety.name': 1,
    'firstname': 1,
    'group': 1
  });
}

//Returns array
export async function findByCommonNameRegex(
  //  this: ITreeModel,
  regex: string
): Promise<ITreeDocument[]> {
  return this.find({ 'cnames.names': { $regex: regex, $options: 'i' } }).select(
    {
      'genus.name': 1,
      'species.name': 1,
      'subspecies.name': 1,
      'variety.name': 1,
      'group': 1,
      'firstname': 1,
      'cnames': 1
    }
  );
}

// //Returns array
// export async function findByCommonNameLanguageRegex(
//  // this: ITreeModel,
//   language: string,
//   regex: string
// ): Promise<ITreeDocument[]> {
//   return this.find({
//     'cnames.language': language,
//     'cnames.names': { $regex: regex, $options: 'i' },
//   }).select({
//     'genus.name': 1,
//     'species.name': 1,
//     'subspecies.name': 1,
//     'variety.name': 1,
//     'firstname': 1,
//     'group': 1,
// //    'cnames.$': 1 //Return only matching names from array  -> break firstname virtual
//     'cnames': 1
//   });
// }


//Returns array
export async function findByCommonNameLanguageRegex(
  // this: ITreeModel,
  language: string,
  regex: string
): Promise<ITreeDocument[]> {
  return this.aggregate(
    [
      {
        $project: {
          'genus.name': 1,
          'species.name': 1,
          'subspecies.name': 1,
          'variety.name': 1,
          'firstname': 1,
          'group': 1,
          'cnames': {     //only matched name
            $arrayElemAt: ['$cnames', { $indexOfArray: ['$cnames.language', language] }]
          }
        }
      },
      {
        $addFields: {
          firstname: {
            $arrayElemAt: [
              '$cnames.names', 0
            ]
          },
          identity: {
            $trim: {
              input: {
                $concat: ["$genus.name", " ", "$species.name", " ",
                  { $ifNull: ["$subspecies.name", "$variety.name", " "] }
                ]
              }
            }
          }
        }
      },
      {
        $match: {
          'cnames.names': { $regex: regex, $options: 'i' }
        }
      }
    ]
  );
}

//Returns array
export async function findBySpeciesNameRegex(
  //  this: ITreeModel,
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
  );
}

//Returns array
export async function findByGroup(
  //  this: ITreeModel,
  group: string
): Promise<ITreeDocument[]> {
  return this.find({ group: group }).select({
    'genus.name': 1,
    'species.name': 1,
    'subspecies.name': 1,
    'variety.name': 1,
    'firstname': 1,
    'group': 1,
    'cnames': 1
  });
}
