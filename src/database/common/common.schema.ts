//Common schema types used by other schemas

import * as Mongoose from 'mongoose';


//Comments
export const CommentSchema = new Mongoose.Schema(
    {
        text: String,
        reference: String,
    },
    { _id: false }
);

//Common names
export const CNamesSchema = new Mongoose.Schema(
    {
        language: String,
        names: { type: [String], default: undefined },
    },
    { _id: false }
);

//Hyperlinks
export const CHyperlinksSchema = new Mongoose.Schema(
    {
        language: String,   //language of the site
        org: String,        //name of the site organization
        link: String        //the URI
    },
    { _id: false }
);