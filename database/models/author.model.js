import { Schema, model } from "mongoose";

const authorSchema = new Schema({
    name: { type: String, required: true, trim: true, },
    bio: { type: String, trim: true, },
    birthDate: { type: Date, },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
    versionKey: false,
});


export const Author = model('Author', authorSchema); 