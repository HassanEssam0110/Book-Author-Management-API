import Joi from "joi";
import { Types } from "mongoose";


const objectIdRule = (value, helpers) => {
    const isObjectIdValid = Types.ObjectId.isValid(value)
    return isObjectIdValid ? value : helpers.message('Invalid Object Id')
}

const DateRule = (value, helpers) => {
    const inputDate = new Date(value);
    // Compare the input date with the current date
    if (inputDate < new Date()) {
        return inputDate;
    } else {
        return helpers.message('Date must be before to the current date');
    }
}

const nameRule = (value, helpers) => {
    const regex = /^(?!.*(?:admin|test)).*$/i;
    const forbidden = !regex.test(value)
    return forbidden ? helpers.message(`Please choose a different name. cannot use 'admin' or 'test' in your name.`) : value;
}

export const generalRules = {
    // ==> general 
    objectId: Joi.string().trim(true).custom(objectIdRule),

    // ==> headers
    headers: {
        "content-type": Joi.string().valid("application/json").optional(),
        "user-agent": Joi.string().optional(),
        host: Joi.string().optional(),
        // "conctent-length": Joi.number().optional(),
        "content-length": Joi.number().optional(),
        "accept-encoding": Joi.string().optional(),
        accept: Joi.string().optional(),
        connection: Joi.string().optional(),
        "postman-token": Joi.string().optional(),
    },

    // ==> AUth rules
    name: Joi.string()
        .trim(true)
        .min(3)
        .max(50)
        .custom(nameRule)
        .messages({
            'string.base': 'Name should be a type of text',
            'string.empty': 'Name is required',
            'string.min': 'Name should have at least 6 characters',
            'string.max': 'Name should have at most 50 characters',
            'any.required': 'Name is a required field'
        }),
    email: Joi.string()
        .trim(true)
        .email()
        .required()
        .messages({
            'string.base': 'Email should be a type of text',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is a required field'
        }),
    password: Joi.string()
        .trim(true)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .invalid('P@ssw0rd', 'Password1!')
        .required()
        .messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password is required',
            'string.pattern.base': 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character (e.g., P@ssw0rd, Password1!)',
            'any.invalid': 'Password cannot be P@ssw0rd or Password1!',
            'any.required': 'Password is a required field'
        }),
    newPassword: Joi.string()
        .trim(true)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .invalid('P@ssw0rd', 'Password1!')
        .required()
        .messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password is required',
            'string.pattern.base': 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character (e.g., P@ssw0rd, Password1!)',
            'any.invalid': 'Password cannot be P@ssw0rd or Password1!',
            'any.required': 'Password is a required field'
        }),

    // ==> AUthor rules
    authorName: Joi.string()
        .trim(true)
        .min(2)
        .max(50)
        .messages({
            'string.base': 'Name should be a type of text',
            'string.empty': 'Name is required',
            'string.min': 'Name should have at least 2 characters',
            'string.max': 'Name should have at most 50 characters',
            'any.required': 'Name is a required field'
        }),
    authorBio: Joi.string()
        .trim(true)
        .min(6)
        .max(200)
        .optional()
        .messages({
            'string.base': 'Bio should be a type of text',
            'string.min': 'Bio should have at least 6 characters',
            'string.max': 'Bio should have at most 200 characters'
        }),
    authorBirthDate: Joi.date().iso().custom(DateRule).messages({
        'date.base': 'BirthDate should be a valid date format (YYYY-MM-DD)',
        'date.format': 'BirthDate should be in ISO format (YYYY-MM-DD)',
        'any.custom': 'BirthDate should be in ISO format (YYYY-MM-DD)',
    }),
}