//import { getUnpackedSettings } from 'http2';
import { IGenus, IGenusDocument } from './genus.types';

export async function findOneOrCreate(
  genus: IGenus
): Promise<IGenusDocument> {
  const record = await this.findOne(genus); //Find one returns the first match NB!
  if (record) {
    return record;
  } else {
    return this.create(genus);
  }
}

//Returns array
export async function findByGenusName(
  name: string
): Promise <IGenusDocument> {
  return this.findOne({ 'name': name }).select({   //If you use "find" you always get an array
    'name': 1,
    'authority': 1,
    'family': 1,
    'cnames': 1,
    'comments': 1,
    'hyperlinks': 1
  }).sort('name');
}

//Returns array
export async function findByGenusNameRegex(
  name: string
): Promise <IGenusDocument[]> {
  return this.find({ 'name': { '$regex': name, '$options': 'i' } }).select({   //If you use "find" you always get an array
    'name': 1,
    'authority': 1,
    'family': 1,
    'cnames': 1,
    'comments': 1,
    'hyperlinks': 1
  }).sort('name');
}


//Note: aggregates return random json and mongoos will not add
// virtual variables by itself, they must be added manually.
export async function findByCommonNameLanguageRegex(
  language: string,
  regex: string
): Promise<IGenusDocument[]> {
  return this.aggregate(
    [{    //Only interested in Familys where this language exists
      $match: {
        'cnames.language': language
      }
    }, {
      $project: {   //Only interested in this language entries
        name: 1,
        anames: {
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
        'anames.names': { $regex: regex, $options: 'i' }
      }
    },
    {
      $addFields: {
        firstname: {
          $reduce: {
            //Match the elemenst from the back, return last match
            input: { $reverseArray: "$anames" },
            initialValue: "$anames.0",
            in: {
              $cond: {
                if: {
                  $regexFind: {
                    input: "$$this",
                    regex: regex,
                    options: "i"
                  }
                },
                then: "$$this",  //If it matches, set value to this
                else: "$$value"  //If not, keep old value
              }
            }
          }
        },
        id: "$_id"  //add id virtual manually sonce mongoos won't for aggregates.
      }
    },
    {
      $project: {
      anames: 0
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



