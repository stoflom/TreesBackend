import { Document, Model, Types } from 'mongoose';
import {IComment,ICNames} from '../common/common.types'


export interface IFamily {
  name: string;
  cnames?: [ICNames];
  genuslist?: [string];
  comments?: [IComment];
}

//db queries return IFamilyDocument
export interface IFamilyDocument extends IFamily, Document {
  //Virtuals are accessible on FamilyDocument, similar to _id property which are built in by mongoose

}

//db create/update/find are called on FamilyModel and return FamilyDocument
export interface IFamilyModel extends Model<IFamilyDocument> {
  //static functions
  findOneOrCreate: (
    //arrow function
    this: IFamilyModel, //fix "this" type using the "fake this parameter"
    Family: IFamily
  ) => Promise<IFamilyDocument>; //CAREFUL! THIS will work on the first matched document
  //see: https://docs.mongodb.com/manual/reference/method/db.collection.findOne/



  findByFamilyName: (
    //arrow function
    this: IFamilyModel,
    Familyname: string
  ) => Promise<IFamilyDocument>;


  findByCommonNameLanguageRegex: (
    //arrow function
    this: IFamilyModel,
    language: string,
    regex: string
  ) => Promise<IFamilyDocument>;


}
