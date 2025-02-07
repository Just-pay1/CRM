import Joi from "joi";

export const CustomerProfileSchemas = {

    create_new: Joi.object().keys({
        legal_name: Joi.string().required(),
        commercial_name: Joi.string().optional(),
        address: Joi.string().required(),
        commercial_reg_number: Joi.string().min(4).max(6).pattern(/^\d+$/).required(),
        
        license_issue_date: Joi.date().required(),
        license_exp_date: Joi.date().greater(Joi.ref('license_issue_date')).required(),
        tax_id_number: Joi.string().length(9).pattern(/^\d+$/).required(),
        
        telephone_number: Joi.string().length(10).pattern(/^\d+$/).required(),
        admin_email: Joi.string().email().required(),
        
        business_type: Joi.string().required(),
        
        bank_name: Joi.string().required(),
        account_holder_name: Joi.string().required(),
        account_type: Joi.string().required(),
        account_number: Joi.string().pattern(/^\d+$/).length(29).required(),
        iban: Joi.string().allow(null).required(),
        swift: Joi.string().allow(null).required(),

        settlement_period: Joi.string().valid('Daily', 'Weekly', 'Monthly').required(),
        settlement_time: Joi.string().required(), // HH:mm format
        
        commission_setup:  Joi.string().valid('Fixed', 'Percentage').required(),
        commission_amount: Joi.number().min(0).max(100).required(),
    })
}