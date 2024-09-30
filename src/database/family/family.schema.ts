import * as Mongoose from 'mongoose';
import { CommentSchema, CNamesSchema } from '../common/common.schema';

import {
  findByFamilyName,
  findByCommonNameLanguageRegex,
} from './family.statics';



const FamilySchema = new Mongoose.Schema(
  {
    //_id automatically added to IFamilyDocument by inheritance from Document
    //Family: { type: FamilySchema, required: true},
    name: { type: String, required: true },
    comments: { type: [CommentSchema], default: undefined },
    cnames: { type: [CNamesSchema], default: undefined },
    genuslist: { type: [String], default: undefined },
  },
  {
    timestamps: true, //Add timestamps, __V (version) will also be added automatically
    toJSON: { virtuals: true }, //virtuals will be returned in toJSON
    toObject: { virtuals: true }, //virtuals will be included in toObject
    collation: { locale: 'en_US', strength: 1 }, //Ignore diacritics & case in matches
  }
);



//Register static methods (must be imported from Familys.statics and made visible in Familys.types)
FamilySchema.statics.findByFamilyName = findByFamilyName;
FamilySchema.statics.findByCommonNameLanguageRegex =
  findByCommonNameLanguageRegex;

//Register instance methods (must be imported from Familys.methods and made visible in Familys.types)
// FamilySchema.methods.setLastUpdated = setLastUpdated;


export default FamilySchema;
