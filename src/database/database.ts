import mongoose from 'mongoose';
import { TreeModel } from './tree/tree.model.ts';
import { GenusModel } from './genus/genus.model.ts';
import { VegetationModel } from './vegetation/vegetation.model.ts';

let database: mongoose.Connection;

export const aTreeModel = TreeModel;
export const aGenusModel = GenusModel;
export const aVegetationModel = VegetationModel;

export const connect = () => {
  // add your own uri below
  const uri =
    //  'mongodb+srv://<treename>:<password>@cluster0-v6q0g.mongodb.net/test?retryWrites=true&w=majority';
    // 'mongodb://localhost:27017/TreesTest'; //SET CORRECT DB NAME HERE
    'mongodb://192.168.0.8:27017/SATrees'; //node does not resolve localhost > v17

  if (database) {
    //Avoiding connecting again
    return;
  }

  mongoose.connect(uri);

  database = mongoose.connection;

  (database as any).once('open', async () => {
    console.log('Connected to database ' + uri);
  });

  (database as any).on('error', () => {
    console.log('Database connection error' + uri);
  });

  (database as any).on('error', (err: any) => {
    console.log('Database error' + err);
  });

  (database as any).on('disconnected', () => {
    console.log('Database disconnected' + uri);
  });

  (database as any).on('reconnected', () => {
    console.log('Database reconnected' + uri);
  });


  return;
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};
