// see: https://codingsans.com/blog/mongoose-models-using-typescript-classes

import { Document, Model, Types } from 'mongoose';
import {IComment,ICNames} from '../common/common.types'


export interface IGenus {
  name: string;
  family?: string;
  cnames?: ICNames[];
  authority?: string;
  comments?: [IComment];
}










//db queries return IGenusDocument
export interface IGenusDocument extends IGenus, Document {
  //Virtuals are accessible on GenusDocument, similar to _id property which are built in by mongoose

}

//db create/update/find are called on GenusModel and return GenusDocument
export interface IGenusModel extends Model<IGenusDocument> {
  //static functions
  findOneOrCreate: (
    //arrow function
    this: IGenusModel, //fix "this" type using the "fake this parameter"
    Genus: IGenus
  ) => Promise<IGenusDocument>; //CAREFUL! THIS will work on the first matched document
  //see: https://docs.mongodb.com/manual/reference/method/db.collection.findOne/



  findByGenusName: (
    //arrow function
    this: IGenusModel,
    genusname: string
  ) => Promise<IGenusDocument[]>;


  findByCommonNameLanguageRegex: (
    //arrow function
    this: IGenusModel,
    language: string,
    regex: string
  ) => Promise<IGenusDocument[]>;


}
