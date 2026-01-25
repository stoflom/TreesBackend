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
    'comments': 1,
    'hyperlinks': 1
  }).sort('name');
}

//Returns array
export async function findByFamilyNameRegex(
  name: string
): Promise<IFamilyDocument[]> {
  return this.find({ 'name': { '$regex': name, '$options': 'i' } }).select({
    'name': 1,
    'cnames': 1,
    'genuslist': 1,
    'comments': 1,
    'hyperlinks': 1
  }).sort('name');
}



//Note: aggregates return random json and mongoos will not add
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

