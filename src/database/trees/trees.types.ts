// see: https://codingsans.com/blog/mongoose-models-using-typescript-classes

import { Document, Model, Types } from 'mongoose';
import {IComment,ICNames} from '../common/common.types'

export interface ITreeGenus {
  name: string;
  id?: string;
}

export interface ISpecies {
  name: string;
  authority?: string;
}

export interface ISynonym {
  genus: string;
  species: ISpecies;
  subspecies?: ISpecies;
  variety?: ISpecies;
}

export interface ITree {
  // _id?: string             //canot declare optional here
  //since it is not-optional in Document by mongoose, so if declared here will be required
  //what is returned from MongoDB is always a TreeDocument with _id included.
  genus: ITreeGenus;
  species: ISpecies;
  subspecies?: ISpecies;
  variety?: ISpecies;
  comment?: IComment;
  FSAnumber?: string;
  Znumber?: string;
  synonyms?: ISynonym[];
  cnames?: ICNames[];
  vegtypes?: string[];
  group?: string[];
  //The next 3 seems to be NOT declared in Document,
  createdAt?: Date;
  updatedAt?: Date;
  __V?: string;
}



//db queries return ITreeDocument
export interface ITreeDocument extends ITree, Document {
  //Virtuals are accessible on TreeDocument, similar to _id property which are built in by mongoose
  //  binomial: (this: ITreeDocument) => string;
  identity: (this: ITreeDocument) => string;
  scientificName: (this: ITreeDocument) => string;
  firstname: (this: ITreeDocument) => string;
}

//db create/update/find are called on TreeModel and return TreeDocument
export interface ITreeModel extends Model<ITreeDocument> {
  //static functions
  findOneOrCreate: (
    //arrow function
    this: ITreeModel, //fix "this" type using the "fake this parameter"
    Tree: ITree
  ) => Promise<ITreeDocument>; //CAREFUL! THIS will work on the first matched document
  //see: https://docs.mongodb.com/manual/reference/method/db.collection.findOne/

  findByGenusName: (
    //arrow function
    this: ITreeModel,
    GenusName: string
  ) => Promise<ITreeDocument[]>;

  findByCommonNameRegex: (
    //arrow function
    this: ITreeModel,
    regex: string
  ) => Promise<ITreeDocument[]>;

  findByCommonNameLanguageRegex: (
    //arrow function
    this: ITreeModel,
    language: string,
    regex: string
  ) => Promise<ITreeDocument[]>;

  findBySpeciesNameRegex: (
    //arrow function
    this: ITreeModel,
    regex: string
  ) => Promise<ITreeDocument[]>;

  findByGenusSpeciesNames: (
    //arrow function
    this: ITreeModel,
    GenusName: string,
    SpeciesName: string
  ) => Promise<ITreeDocument[]>;

  findByGroup: (
    //arrow function
    this: ITreeModel,
    group: string
  ) => Promise<ITreeDocument[]>;
}
