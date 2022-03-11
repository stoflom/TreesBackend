import * as Mongoose from 'mongoose';
import TreeSchema from './tree.schema';
import { ITreeDocument, ITreeModel } from './tree.types';

export const TreeModel = Mongoose.model<ITreeDocument>(
  'treecol', //NB this means the MongoDB collection will be "treecols"  (lower case plural of tree)
 
  TreeSchema
) as ITreeModel;

