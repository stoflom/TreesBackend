import mongoose from 'mongoose';
import GenusSchema from './genus.schema.ts';
import { IGenusDocument, IGenusModel } from './genus.types.ts';

export const GenusModel = mongoose.model<IGenusDocument>(
  'genuscol', //NB this means the MongoDB collection will be "genuscols"  (lower case plural)
 
  GenusSchema
) as IGenusModel;
