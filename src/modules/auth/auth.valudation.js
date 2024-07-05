import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";



export const signupValidator = {
    body: Joi.object({
        name: generalRules.name.required(),
        email: generalRules.email,
        password: generalRules.password,
        cPassword: Joi.string()
            .trim(true)
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'string.base': 'Confirm password should be a type of text',
                'string.empty': 'Confirm password is required',
                'any.only': 'Confirm password does not match password',
                'any.required': 'Confirm password is a required field'
            }),
    }),
    headers: Joi.object({ ...generalRules.headers, })
}

export const changePasswordValidator = {
    body: Joi.object({
        password: generalRules.password,
        newPassword: generalRules.newPassword,
        cPassword: Joi.string()
            .trim(true)
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'string.base': 'Confirm password should be a type of text',
                'string.empty': 'Confirm password is required',
                'any.only': 'Confirm password does not match password',
                'any.required': 'Confirm password is a required field'
            }),

    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const virfiyEmailValudator = {
    body: Joi.object({
        virifyCode: Joi.string()
            .trim(true)
            .length(6)
            .required()
            .messages({
                'string.base': 'Verify code should be a type of text',
                'string.empty': 'Verify code is required',
                'string.length': 'Verify code must be exactly 6 characters long',
                'any.required': 'Verify code is a required field'
            })
    }),
    headers: Joi.object({ ...generalRules.headers, })
}

export const resendCodeValudator = {
    body: Joi.object({
        email: generalRules.email
    }),
    headers: Joi.object({ ...generalRules.headers, })
}

export const signinValidator = {
    body: Joi.object({
        email: generalRules.email,
        password: generalRules.password,
    }),
    headers: Joi.object({ ...generalRules.headers })
}