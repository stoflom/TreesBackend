//Common schema types used by other schemas

import * as Mongoose from 'mongoose';


export const CommentSchema = new Mongoose.Schema(
    {
        text: String,
        reference: String,
    },
    { _id: false }
);

export const CNamesSChema = new Mongoose.Schema(
    {
        language: String,
        names: { type: [String], default: undefined },
    },
    { _id: false }
);
