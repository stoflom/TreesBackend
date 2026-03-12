import mongoose from 'mongoose';
import { IVegetationDocument, IVegetationModel } from './vegetation.types.ts';
import { findByAbbreviation } from './vegetation.statics.ts';

const VegetationSchema = new mongoose.Schema(
  {
    abbreviation: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collation: { locale: 'en_US', strength: 1 },
  }
);

// Register static methods
VegetationSchema.statics.findByAbbreviation = findByAbbreviation;

export default VegetationSchema;