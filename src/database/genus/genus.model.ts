import * as Mongoose from 'mongoose';
import GenusSchema from './genus.schema';
import { IGenusDocument, IGenusModel } from './genus.types';

export const GenusModel = Mongoose.model<IGenusDocument>(
  'genuscol', //NB this means the MongoDB collection will be "genuscols"  (lower case plural)
 
  GenusSchema
) as IGenusModel;
