import * as Mongoose from 'mongoose';
import GenusSchema from './genus.schema';
import { IGenusDocument, IGenusModel } from './genus.types';

export const GenusModel = Mongoose.model<IGenusDocument>(
  'genera', //NB this means the MongoDB collection will be "genera"  (lower case plural of tree)
  //"fsatree",                                                    //Only trees with FSANumbers, as requested by SANBI
  GenusSchema
) as IGenusModel;
