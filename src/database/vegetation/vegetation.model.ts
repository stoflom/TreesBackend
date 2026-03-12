import mongoose from 'mongoose';
import VegetationSchema from './vegetation.schema.ts';
import { IVegetationDocument, IVegetationModel } from './vegetation.types.ts';

export const VegetationModel = mongoose.model<IVegetationDocument>(
  'vegetationcol', // This matches the MongoDB collection "vegetationcols"
  VegetationSchema
) as IVegetationModel;