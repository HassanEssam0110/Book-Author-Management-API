import { Schema, model } from "mongoose";


const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    otpCode: {
        type: String,
    },
    otpExpire: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    passwordChangedAt: Date,
}, {
    timestamps: true,
    versionKey: false,
})


export const User = model('User', schema);