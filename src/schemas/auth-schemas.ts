import Joi from "joi";


export const authSchemas = {

    loginSchema: Joi.object(
        {
            email: Joi.string().required(),
            password: Joi.string().min(6).max(12).pattern(/^[a-zA-Z0-9@#$%^&+!=*]+$/).required()
        }
    ),

    rest_password_schema: Joi.object().keys({
        resetToken: Joi.string().required(),
        newPassword: Joi.string().min(8).max(12).pattern(/^[a-zA-Z0-9@#$%^&+!=*]+$/).required(),
        confirmedPassword: Joi.string().min(8).max(12).pattern(/^[a-zA-Z0-9@#$%^&+!=*]+$/).required(),
    }),

    set_pincode_schema: Joi.object().keys({
        pinCode: Joi.string().length(4).pattern(/^\d+$/).required(),
        confirmedPinCode: Joi.string().length(4).pattern(/^\d+$/).required(),
    }),

    confirm_pincode_schema: Joi.object().keys({
        pinCode: Joi.string().length(4).pattern(/^\d+$/).required(),
    }), 

    forget_password_schema: Joi.object().keys({
        email: Joi.string().required(),
    }), 

    change_password_schema: Joi.object().keys({
        oldPassword: Joi.string().min(8).max(12).pattern(/^[a-zA-Z0-9@#$%^&+!=*]+$/).required(),
        newPassword: Joi.string().min(8).max(12).pattern(/^[a-zA-Z0-9@#$%^&+!=*]+$/).required(),
        confirmedPassword: Joi.string().min(8).max(12).pattern(/^[a-zA-Z0-9@#$%^&+!=*]+$/).required(),
    }),

    change_pincode_schema: Joi.object().keys({
        oldPinCode:  Joi.string().length(4).pattern(/^\d+$/).required(),
        newPinCode:  Joi.string().length(4).pattern(/^\d+$/).required(),
        confirmedPinCode:  Joi.string().length(4).pattern(/^\d+$/).required()
    })

}
