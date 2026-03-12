import mongoose from 'mongoose';

export interface IVegetationDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  abbreviation: string;
  description: string;
  name: string;
}

export interface IVegetationModel extends mongoose.Model<IVegetationDocument> {
  findByAbbreviation(abbreviation: string): Promise<IVegetationDocument>;
}