import mongoose from 'mongoose';
import { IVegetationDocument } from './vegetation.types.ts';

export const findByAbbreviation = async function(
  abbreviation: string
): Promise<IVegetationDocument> {
  return this.findOne({ abbreviation: abbreviation });
};