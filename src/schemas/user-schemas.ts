import Joi from "joi";

export const userCreate = Joi.object(
    {
        // personal data 
        first_name: Joi.string().min(3).required(),
        middle_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        dob: Joi.date().less('1-1-2010').required(),
        email: Joi.string().email().required(),
        mobile: Joi.number().min(11).required(),
        //  JustPay data 
        working_hours: Joi.number().required(),
        working_days: Joi.array()
            .items(Joi.string().valid('sat', 'sun', 'mon', 'tues', 'wed', 'thur', 'fri'))
            .required(),
        role: Joi.string().valid('superadmin', 'sales', 'operation', 'financial').required(),
    }
)

export const setPassword = Joi.object(
    {
        password: Joi.string().min(6).max(10).pattern(/^[a-zA-Z0-9@#$]+$/).required(),
        confirmed_password: Joi.string().min(6).max(10).pattern(/^[a-zA-Z0-9@#$]+$/).required()
    }
)

export const setPinCode = Joi.object(
    {
        pin_code: Joi.string().length(4).required(),
        confirm_pin_code: Joi.string().length(4).required(),
    }
)

export const changePassword = Joi.object(
    {
        old_password: Joi.string().min(6).max(10).pattern(/^[a-zA-Z0-9@#$]+$/).required(),
        new_password: Joi.string().min(6).max(10).pattern(/^[a-zA-Z0-9@#$]+$/).required(),
        confirm_new_password: Joi.string().min(6).max(10).pattern(/^[a-zA-Z0-9@#$]+$/).required(),
    }
)

export const changePinCode = Joi.object(
    {
        old_pin_code: Joi.string().length(4).required(),
        new_pin_code: Joi.string().length(4).required(),
        confirm_pin_code: Joi.string().length(4).required(),
    }
)