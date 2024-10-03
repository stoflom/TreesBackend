import * as Mongoose from 'mongoose';
import { CommentSchema, CNamesSchema, CHyperlinksSchema } from '../common/common.schema';

import {
  findByGenusName,
  findByCommonNameLanguageRegex,
} from './genus.statics';



const GenusSchema = new Mongoose.Schema(
  {
    //_id automatically added to IGenusDocument by inheritance from Document
    //genus: { type: GenusSchema, required: true},
    name: { type: String, required: true },
    authority: String,
    family: String,
    comments: { type: [CommentSchema], default: undefined },
    cnames: { type: [CNamesSchema], default: undefined },
    hyperlinks : { type: [CHyperlinksSchema], default: undefined }
  },
  {
    timestamps: true, //Add timestamps, __V (version) will also be added automatically
    toJSON: { virtuals: true }, //virtuals will be returned in toJSON
    toObject: { virtuals: true }, //virtuals will be included in toObject
    collation: { locale: 'en_US', strength: 1 }, //Ignore diacritics & case in matches
  }
);



//Register static methods (must be imported from Genuss.statics and made visible in Genuss.types)
GenusSchema.statics.findByGenusName = findByGenusName;
GenusSchema.statics.findByCommonNameLanguageRegex =
  findByCommonNameLanguageRegex;

//Register instance methods (must be imported from Genuss.methods and made visible in Genuss.types)
// GenusSchema.methods.setLastUpdated = setLastUpdated;


export default GenusSchema;
