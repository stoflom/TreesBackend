import * as Mongoose from 'mongoose';

export interface IVegetationDocument extends Mongoose.Document {
  _id: Mongoose.Types.ObjectId;
  abbreviation: string;
  description: string;
  name: string;
}

export interface IVegetationModel extends Mongoose.Model<IVegetationDocument> {
  findByAbbreviation(abbreviation: string): Promise<IVegetationDocument>;
}