import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";


export const getBookListValidator = {
    query: Joi.object({
        page: Joi.number()
            .integer()
            .positive()
            .optional()
            .messages({
                'number.base': 'Page must be a number',
                'number.integer': 'Page must be an integer',
                'number.positive': 'Page must be a positive number'
            }),
        limit: Joi.number()
            .integer()
            .positive()
            .optional()
            .messages({
                'number.base': 'Limit must be a number',
                'number.integer': 'Limit must be an integer',
                'number.positive': 'Limit must be a positive number'
            }),
        sort: Joi.string()
            .optional(),
        search: Joi.string()
            .optional(),
        fields: Joi.string()
            .optional(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const getBookValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
};

export const createBookVlidator = {
    body: Joi.object({
        title: Joi.string()
            .trim(true)
            .min(3)
            .max(200)
            .required()
            .messages({
                'string.base': 'Title should be a type of text',
                'string.empty': 'Title is required',
                'string.min': 'Title should have at least 3 characters',
                'string.max': 'Title should have at most 200 characters',
                'any.required': 'Title is a required field'
            }),
        content: Joi.string()
            .trim(true)
            .min(3)
            .required()
            .messages({
                'string.base': 'Content should be a type of text',
                'string.empty': 'Content is required',
                'string.min': 'Content should have at least 3 characters',
                'any.required': 'Content is a required field'
            }),
        author: generalRules.objectId.required()
            .messages({
                'any.required': 'Author is a required field',
            }),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const updateBookValidator = {
    body: Joi.object({
        title: Joi.string()
            .trim(true)
            .min(3)
            .max(200)
            .optional()
            .messages({
                'string.base': 'Title should be a type of text',
                'string.empty': 'Title is required',
                'string.min': 'Title should have at least 3 characters',
                'string.max': 'Title should have at most 200 characters'
            }),
        content: Joi.string()
            .trim(true)
            .min(3)
            .optional()
            .messages({
                'string.base': 'Content should be a type of text',
                'string.empty': 'Content is required',
                'string.min': 'Content should have at least 3 characters',
            }),
        author: generalRules.objectId.optional()
            .messages({
                'any.required': 'Author is a required field',
            }),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const deleteBookValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
};