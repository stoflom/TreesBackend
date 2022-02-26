import * as Mongoose from 'mongoose';
import { ITreeDocument } from './trees.types';

import {
  findOneOrCreate,
  findByGenusName,
  findByGenusSpeciesNames,
  findByCommonNameRegex,
  findByCommonNameLanguageRegex,
  findBySpeciesNameRegex,
  findByGroup,
} from './trees.statics';

const GenusSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: Mongoose.SchemaTypes.ObjectId, ref: 'GeneraSchema' },
  },
  { _id: false }
);

const SpeciesSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    authority: String,
  },
  { _id: false }
);

const CommentSchema = new Mongoose.Schema(
  {
    text: String,
    reference: String,
  },
  { _id: false }
);

const SynonymSchema = new Mongoose.Schema(
  {
    genus: String,
    species: SpeciesSchema,
    subspecies: SpeciesSchema,
    variety: SpeciesSchema,
  },
  { _id: false }
);

const CNamesSChema = new Mongoose.Schema(
  {
    language: String,
    names: { type: [String], default: undefined },
  },
  { _id: false }
);

const TreeSchema = new Mongoose.Schema(
  {
    //_id automatically added to ItreeDocument by inheritance from Document
    genus: { type: GenusSchema, required: true },
    species: { type: SpeciesSchema, required: true },
    subspecies: SpeciesSchema,
    variety: SpeciesSchema,
    comment: CommentSchema,
    FSAnumber: String,
    Znumber: String,
    synonyms: { type: [SynonymSchema], default: undefined }, // default : undefined stops mongoose from making blank arrays
    cnames: { type: [CNamesSChema], default: undefined },
    vegtypes: { type: [String], default: undefined },
    group: { type: [String], default: undefined },
  },
  {
    timestamps: true, //Add timestamps, __V (version) will also ne added automatically
    toJSON: { virtuals: true }, //virtuals will be returned in toJSON
    toObject: { virtuals: true }, //virtuals will be included in toObject
    collation: { locale: 'en_US', strength: 1 }, //Ignore diacritics & case in matches
  }
);

// NOTE: virtuals are not automatically
//included in query responses, pass {virtuals: true} to toJSON

//Virtual fields (must be made visible in trees.types interface on ITreeDocument)
//TreeSchema.virtual('binomial').get(function (this: ITreeDocument): string {
//returns e.g. "Acacia erioloba"
//  return this.genus.name + ' ' + this.species.name;
//});

TreeSchema.virtual('identity').get(function (this: ITreeDocument): string {
  //returns e.g. "Acacia erioloba subsp. xxx var. yyy"
  let identity: string = this.genus.name + ' ' + this.species.name;
  if (this.subspecies) {
    identity += ' subsp. ' + this.subspecies.name;
  }
  if (this.variety) {
    identity += ' var. ' + this.variety.name;
  }
  return identity;
});

TreeSchema.virtual('scientificName').get(function (this: ITreeDocument): string {
  //returns e.g. "Acacia erioloba auth. subsp. xxx auth. var. yyy auth."
  let identity: string = this.genus.name + ' ' + this.species.name;
  if (this.species.authority) {
    identity += ' ' + this.species.authority;
  }
  if (this.subspecies) {
    identity += ' subsp. ' + this.subspecies.name;
    if (this.subspecies.authority) {
      identity += ' ' + this.subspecies.authority;
    }
  }
  if (this.variety) {
    identity += ' var. ' + this.variety.name;
    if (this.variety.authority) {
      identity += ' ' + this.variety.authority;
    }
  }
  return identity;
});

TreeSchema.virtual('firstname').get(function (this: ITreeDocument): string {
  //returns e.g. first common name entries for english/afrikaans
  for (let cname of this.cnames) {
    if (cname.language == 'Eng') {
      var engname = cname.names[0];
    } else if (cname.language == 'Afr') {
      var afrname = cname.names[0];
    }
  }
  return (engname.trim() + '/' + afrname.trim());
});

//Register static methods (must be imported from trees.statics and made visible in trees.types)
TreeSchema.statics.findOneOrCreate = findOneOrCreate;
TreeSchema.statics.findByGenusName = findByGenusName;
TreeSchema.statics.findByGenusSpeciesNames = findByGenusSpeciesNames;
TreeSchema.statics.findByCommonNameRegex = findByCommonNameRegex;
TreeSchema.statics.findByCommonNameLanguageRegex =
  findByCommonNameLanguageRegex;
TreeSchema.statics.findBySpeciesNameRegex = findBySpeciesNameRegex;
TreeSchema.statics.findByGroup = findByGroup;

//Register instance methods (must be imported from trees.methods and made visible in trees.types)
// TreeSchema.methods.setLastUpdated = setLastUpdated;

export default TreeSchema;
