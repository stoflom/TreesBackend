import { connect, disconnect } from '../database/database';
import { Types } from 'mongoose';
import { TreeModel } from '../database/trees/trees.model';

//Dumps common names data for  SANBI

(async () => {
  const db = connect();

  //get all trees
  const alltrees = await db.TreeModel.find({});
  for (let tree of alltrees) {
    //Create '=' delimited table of names (Note  some authorities contain ',')
    for (let cname of tree.cnames) {
      for (let name of cname.names) {
        console.log(
          tree.scientificName +
            '=' +
            name +
            '=' +
            cname.language +
            '=' +
            tree.id +
            '=' +
            tree.FSAnumber +
            '=' +
            tree.Znumber
        );
      }
    }
  }

  disconnect();
})();
