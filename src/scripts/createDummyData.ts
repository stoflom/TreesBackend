import { TreeModel } from '../database/tree/tree.model';
import { connect, disconnect } from '../database/database';
import { Types } from 'mongoose';

(async () => {
  connect();

  const trees = [
    {
      genus: { name: 'Doctor', id: '1' },
      species: { name: 'Watson', authority: 'me' },
      subspecies: { name: 'Subspecies', authority: 'Someone else' },
      variety: { name: 'Variety', authority: 'Variety guru' },
      comment: { text: 'A nasty comment', reference: 'nasty nasty' },
      FSAnumber: 'FSA12345',
      Znumber: 'Z12345',
      synonyms: [
        {
          genus: 'synonym',
          species: { name: 'synspecies', authority: 'synauth' },
        },
      ],
      cnames: [
        { language: 'Eng', names: ['good name', 'bad name'] },
        { language: 'Afr', names: ['mooi', 'nie lelik'] },
      ],
      vegtypes: ['aa', 'ba', 'ca', 'da'],
    },
    {
      genus: { name: 'Emma', id: '2' },
      species: { name: 'Holmes', authority: 'me' },
      subspecies: { name: 'Subspecies', authority: 'Someone else' },
      variety: { name: 'Variety', authority: 'Variety guru' },
      comment: { text: 'A nasty comment', reference: 'nasty nasty' },
      FSAnumber: 'FSA12344',
      Znumber: 'Z12344',
      synonyms: [
        {
          genus: 'synonym',
          species: { name: 'synspecies', authority: 'synauth' },
        },
      ],
      cnames: [
        { language: 'Eng', names: ['good name', 'bad name'] },
        { language: 'Afr', names: ['mooi', 'nie lelik'] },
      ],
      vegtypes: ['aa', 'ba', 'ca', 'da'],
    },
    {
      genus: { name: 'Sherlock', id: '3' },
      species: { name: 'Watson', authority: 'myself' },
      subspecies: { name: 'Subspecies', authority: 'Someone else' },
      variety: { name: 'Variety', authority: 'Variety guru' },
      comment: { text: 'A nasty comment', reference: 'nasty nasty' },
      FSAnumber: 'FSA123456',
      Znumber: 'Z123457',
      synonyms: [
        {
          genus: 'synonym',
          species: { name: 'synspecies', authority: 'synauth' },
        },
      ],
      cnames: [
        { language: 'Eng', names: ['good name', 'bad name'] },
        { language: 'Afr', names: ['mooi', 'nie lelik'] },
      ],
      vegtypes: ['aa', 'bb', 'bc', 'bd'],
    },
  ];

  try {
    for (const tree of trees) {
      await TreeModel.create(tree);
      console.log(`Created tree ${tree.genus.name} ${tree.species.name}`);
    }

    disconnect();
  } catch (e) {
    console.log(e);
  }
})();
