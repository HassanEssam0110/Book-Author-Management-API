import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";

export const getAuthorListValidator = {
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
};

export const getAuthorValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
};

export const createAuthorValidator = {
    body: Joi.object({
        name: generalRules.authorName.required(),
        bio: generalRules.authorBio.optional(),
        birthDate: generalRules.authorBirthDate.optional()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
};

export const updateAuthorValidator = {
    body: Joi.object({
        name: generalRules.authorName.optional(),
        bio: generalRules.authorBio.optional(),
        birthDate: generalRules.authorBirthDate.optional()
    }),
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
};

export const deleteAuthorValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
};