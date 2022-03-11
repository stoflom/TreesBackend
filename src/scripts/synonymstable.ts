import { connect, disconnect } from '../database/database';
import { Types } from 'mongoose';
import { TreeModel } from '../database/tree/tree.model';

//Dumps synonyms data for  SANBI

(async () => {
  const db = connect();

  //get all trees
  //const alltrees = await db.TreeModel.find({});
  const alltrees = await TreeModel.find({});
  for (let tree of alltrees) {
    //Create '=' delimited table of names (Note  some authorities contain ',')
    if (tree.synonyms) {
      for (var i = 0; i < tree.synonyms.length; i++) {
        var synonym = tree.synonyms[i]; //aparently synonyms is not iterable?
        var syno: string = synonym.genus + ' ' + synonym.species.name;

        if (synonym.species.authority) {
          syno += ' ' + synonym.species.authority;
        }

        if (synonym.subspecies) {
          syno += ' subsp. ' + synonym.subspecies.name;
          if (synonym.subspecies.authority) {
            syno += ' ' + synonym.subspecies.authority;
          }
        }
        if (synonym.variety) {
          syno += ' var. ' + synonym.variety.name;
          if (synonym.variety.authority) {
            syno += ' ' + synonym.variety.authority;
          }
        }

        syno += '=' + tree.scientificName;

        console.log(syno);
      }
    }
  }

  disconnect();
})();
