import * as Mongoose from 'mongoose';
import { IVegetationDocument } from './vegetation.types';

export const findByAbbreviation = async function(
  abbreviation: string
): Promise<IVegetationDocument> {
  return this.findOne({ abbreviation: abbreviation });
};