import * as Mongoose from 'mongoose';
import FamilySchema from './family.schema';
import { IFamilyDocument, IFamilyModel } from './family.types';

export const FamilyModel = Mongoose.model<IFamilyDocument>(
  'familycol', //NB this means the MongoDB collection will be "familycols"  (lower case plural)

  FamilySchema
) as IFamilyModel;
