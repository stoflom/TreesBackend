import mongoose from 'mongoose';
import FamilySchema from './family.schema.ts';
import { IFamilyDocument, IFamilyModel } from './family.types.ts';

export const FamilyModel = mongoose.model<IFamilyDocument>(
  'familycol', //NB this means the MongoDB collection will be "familycols"  (lower case plural)

  FamilySchema
) as IFamilyModel;
