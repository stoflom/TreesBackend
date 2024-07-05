import * as Mongoose from 'mongoose';
import { TreeModel } from './tree/tree.model';
import { GenusModel } from './genus/genus.model';

let database: Mongoose.Connection;

export const aTreeModel = TreeModel;
export const aGenusModel = GenusModel;

export const connect = () => {
  // add your own uri below
  const uri =
    //  'mongodb+srv://<treename>:<password>@cluster0-v6q0g.mongodb.net/test?retryWrites=true&w=majority';
    // 'mongodb://localhost:27017/TreesTest'; //SET CORRECT DB NAME HERE
    'mongodb://127.0.0.1:27017/SATrees'; //node does not resolve localhost > v17

  if (database) {
    //Avoiding connecting again
    return;
  }

  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  database = Mongoose.connection;

  database.once('open', async () => {
    console.log('Connected to database ' + uri);
  });

  database.on('error', () => {
    console.log('Database connection error' + uri);
  });

  database.on('error', err => {
    console.log('Database error' + err);
  });

  database.on('disconnected', () => {
    console.log('Database disconnected' + uri);
  });

  database.on('reconnected', () => {
    console.log('Database reconnected' + uri);
  });


  return;
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};
