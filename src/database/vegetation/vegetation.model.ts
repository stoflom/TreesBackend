import * as Mongoose from 'mongoose';
import VegetationSchema from './vegetation.schema';
import { IVegetationDocument, IVegetationModel } from './vegetation.types';

export const VegetationModel = Mongoose.model<IVegetationDocument>(
  'vegetationcol', // This matches the MongoDB collection "vegetationcols"
  VegetationSchema
) as IVegetationModel;