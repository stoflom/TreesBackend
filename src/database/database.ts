import mongoose from 'mongoose';
import { TreeModel } from './tree/tree.model.ts';
import { GenusModel } from './genus/genus.model.ts';
import { VegetationModel } from './vegetation/vegetation.model.ts';

let database: mongoose.Connection;

export const aTreeModel = TreeModel;
export const aGenusModel = GenusModel;
export const aVegetationModel = VegetationModel;

export const connect = () => {
  const uri = Deno.env.get('MONGODB_URI') || 'mongodb://192.168.0.8:27017/SATrees';

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
