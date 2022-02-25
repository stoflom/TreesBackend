import * as Mongoose from 'mongoose';
import TreeSchema from './trees.schema';
import { ITreeDocument, ITreeModel } from './trees.types';

export const TreeModel = Mongoose.model<ITreeDocument>(
  'tree', //NB this means the MongoDB collection will be "trees"  (lower case plural of tree)
  //"fsatree",                                                    //Only trees with FSANumbers, as requested by SANBI
  TreeSchema
) as ITreeModel;
