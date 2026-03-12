import mongoose from 'mongoose';
import TreeSchema from './tree.schema.ts';
import { ITreeDocument, ITreeModel } from './tree.types.ts';

export const TreeModel = mongoose.model<ITreeDocument>(
  'treecol', //NB this means the MongoDB collection will be "treecols"  (lower case plural of tree)
 
  TreeSchema
) as ITreeModel;

