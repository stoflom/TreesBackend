import { connect, disconnect } from '../database/database';
import { TreeModel } from '../database/tree/tree.model';
import { Types } from 'mongoose';

(async () => {
  const db = connect();

  //Call mongoose bultin create directly:
  const anewTree = await TreeModel.create({
    genus: { name: 'Sherlock', id: '134567' },
    species: { name: 'Holmes', authority: 'myself' },
    subspecies: { name: 'Subspecies', authority: 'Someone else' },
    variety: { name: 'Variety', authority: 'Variety guru' },
    comment: { text: 'A nasty comment', reference: 'nasty nasty' },
    FSAnumber: 'FSA123456789',
    Znumber: 'Z123457',
    synonyms: [
      {
        genus: 'synonym',
        species: { name: 'synspecies', authority: 'synauth' },
      },
    ],
    cnames: [{ language: 'Afr', names: ['good name', 'bad name'] }],
    vegtypes: ['abc', 'sdf'],
  });

  //Or use the static constructor
  const newTree = await TreeModel.findOneOrCreate({
    genus: { name: 'Sherlock', id: '1345' },
    species: { name: 'Holmes', authority: 'myself' },
    subspecies: { name: 'Subspecies', authority: 'Someone else' },
    variety: { name: 'Variety', authority: 'Variety guru' },
    comments: [{ text: 'A nasty comment', reference: 'nasty nasty' }],
    FSAnumber: 'FSA123456',
    Znumber: 'Z123457',
    synonyms: [
      {
        genus: 'synonym',
        species: { name: 'synspecies', authority: 'synauth' },
      },
    ],
    cnames: [{ language: 'Afr', names: ['good name', 'bad name'] }],
    vegtypes: ['abc', 'sdf'],
  });
  console.log('Identity: ' + newTree.identity);

  //Another using the static constructor
  const anothernewTree = await TreeModel.findOneOrCreate({
    genus: { name: 'Sherlock', id: '14567' }, //only first two parameters are required
    species: { name: 'Holmes', authority: 'myself' },
    cnames: [{ language: 'Afr', names: ['good name', 'bad name'] }],
    vegtypes: ['abc', 'sdf'],
  });
  anothernewTree.FSAnumber = '2002';
  anothernewTree.cnames.push({
    language: 'Eng',
    names: ['*the', 'english', 'names'],
  });
  await anothernewTree.save(); //Must "await" to get accurate query below
  console.log('Identity: ' + anothernewTree.identity);
  console.log('toJSON with virtuals\n');
  console.log(anothernewTree.toJSON({ virtuals: true }));

  // test static methods
  const otherTrees = await TreeModel.findByGenusName('Sherlock');
  console.log('otherTrees:\n' + otherTrees);

  const singleTree = await TreeModel.findById('5fae3c23cd7252082772bd67'); //Built in method
  console.log('singleTree:\n' + singleTree);

  const regexTrees = await TreeModel.findByCommonNameRegex('Sher');
  console.log('regexTrees:\n' + regexTrees);

  // Model built in method
  const existingTrees = await TreeModel.find({ 'genus.name': 'Doctor' }); //This is not the override
  console.log('existingTrees:\n' + existingTrees);

  const numOfTrees = (await TreeModel.find()).length;
  console.log('Number of trees: ' + numOfTrees); //Using log({}) prints json (seems).

  disconnect();
})();
