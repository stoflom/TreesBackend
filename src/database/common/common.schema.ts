//Common subschema types used by other schemas

import mongoose from 'mongoose';


//Comments
export const CommentSchema = new mongoose.Schema(
    {
        text: String,
        reference: String,
    },
    { _id: false }   //These subschemas do not have ID's.
);

//Common names
export const CNamesSchema = new mongoose.Schema(
    {
        language: String,
        names: { type: [String], default: undefined },
    },
    { _id: false }
);

//Hyperlinks
export const CHyperlinksSchema = new mongoose.Schema(
    {
        language: String,   //language of the site
        org: String,        //name of the site organization
        link: String        //the URI
    },
    { _id: false }
);