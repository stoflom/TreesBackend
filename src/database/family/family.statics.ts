//import { getUnpackedSettings } from 'http2';
import { IFamily, IFamilyDocument } from './family.types';

export async function findOneOrCreate(
  Family: IFamily
): Promise<IFamilyDocument> {
  const record = await this.findOne(Family); //Find one returns the first match NB!
  if (record) {
    return record;
  } else {
    return this.create(Family);
  }
}

//Returns array
export async function findByFamilyName(
  name: string
): Promise<IFamilyDocument> {
  return this.findOne({ 'name': name }).select({
    'name': 1,
    'cnames': 1,
    'genuslist': 1,
    'comments': 1
  });
}



//Note: aggregates return random jason and mongoos will not add
// virtual variables by itself, they must be added manually.
export async function findByCommonNameLanguageRegex(
  language: string,
  regex: string
): Promise<IFamilyDocument[]> {
  return this.aggregate(
    [{    //Only interested in Familys where this language exists
      $match: {
        'cnames.language': language
      }
    }, {
      $project: {   //Only interested in these language entries
        Family: 1,
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
      $match: {     //Only interested in Familys where the cname mathes the regex
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
              $concat: ["$Family.name", " ", "$species.name", " ",
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

