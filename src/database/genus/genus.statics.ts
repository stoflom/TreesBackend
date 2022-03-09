//import { getUnpackedSettings } from 'http2';
import { IGenus, IGenusDocument } from './genus.types';

export async function findOneOrCreate(
  //  this: IGenusModel, //Dummy for invoking findOne method
  Genus: IGenus
): Promise<IGenusDocument> {
  const record = await this.findOne(Genus); //Find one returns the first match NB!
  if (record) {
    return record;
  } else {
    return this.create(Genus);
  }
}

//Returns array
export async function findByGenusName(
  name: string
): Promise<IGenusDocument> {
  return this.find({ 'name': name }).select({
    'name': 1,
    'authority': 1,
    'family': 1,
    'afrnames': 1,
    'engnames': 1,
  });
}



//Note: aggregates return random jason and mongoos will not add
// virtual variables by itself, they must be added manually.
export async function findByCommonNameLanguageRegex(
  language: string,
  regex: string
): Promise<IGenusDocument[]> {
  return this.aggregate(
    [{    //Only interested in Genuss where this language exists
      $match: {
        'cnames.language': language
      }
    }, {
      $project: {   //Only interested in these language entries
        genus: 1,
        species: 1,
        cnames: {
          $arrayElemAt: [
            '$cnames',
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
    {
      $match: {     //Only interested in Genuss where the cname mathes the regex
        'cnames.names': { $regex: regex, $options: 'i' }
      }
    },
    {
      $addFields: {
        firstname: {      //Need a firstname for display
          $arrayElemAt: ['$cnames.names', 0]  //will not always be the matching name 
        },
        identity: {       //Also need identity, add virtual manually sonce mongoos won't for aggregates.
          $trim: {
            input: {
              $concat: ["$genus.name", " ", "$species.name", " ",
                { $ifNull: ["$subspecies.name", "$variety.name", " "] }
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
    // , function (err: Error) {
    //   if (err)
    //     console.warn('***ERROR:' + err.message);  //Must stop crash from happening?
    //     return("{[]}");
    // }
  );
}

