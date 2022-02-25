import { connect, disconnect } from '../database/database';
import { Types } from 'mongoose';

//Readonly test of SATrees database, trees collection (set connection appropriately in server.ts)

(async () => {
  const db = connect();

  // test static methods
  const adenias = await db.TreeModel.findByGenusName('Adenia');
  console.log('adenias:\n');
  console.log({ adenias });

  // Or use model built-in method directly
  const albizias = await db.TreeModel.find({ 'genus.name': 'Albizia' });
  console.log('albizias:\n');
  console.log({ albizias });

  const mytrees = await db.TreeModel.findByGenusSpeciesNames(
    'Acacia',
    'amythethophylla'
  ); //can be different subsp.s or var.s, so more than 1
  console.log('mytrees:\n');
  console.log(JSON.stringify(mytrees, null, '\t'));

  //get all trees
  const alltrees = await db.TreeModel.find({});
  //Save all trees to set createdAt fields
  for (let tree of alltrees) {
    tree.save();
  }

  const numOfTrees = (await db.TreeModel.find()).length;
  console.log('Number of trees: ' + numOfTrees); //Using log({}) prints json (seems).

  //update version  (also updates updatedAt field)
  await db.TreeModel.updateMany({}, { $set: { __v: '1.1' } });

  disconnect();
})();
