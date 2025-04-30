import Joi from "joi";

export const merchantSchemas = {
    create_new: Joi.object().keys({
        legal_name: Joi.string().required(),
        commercial_name: Joi.string().optional(),
        address: Joi.string().required(),
        commercial_reg_number: Joi.string()
            .min(4)
            .max(6)
            .pattern(/^\d+$/)
            .required(),

        license_issue_date: Joi.date().required(),
        license_exp_date: Joi.date()
            .greater(Joi.ref("license_issue_date"))
            .required(),
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

        settlement_period: Joi.string()
            .valid("Daily", "Weekly", "Monthly")
            .required(),
        settlement_time: Joi.string().required(), // HH:mm format

        commission_setup: Joi.string().valid("Fixed", "Percentage").required(),
        commission_amount: Joi.number().min(0).max(100).required(),

        longitude: Joi.string().required(),
        latitude: Joi.string().required(),
    }),

    list: Joi.object().keys({
        page: Joi.string()
            .pattern(/^(?:0|[1-9][0-9]*|-1)$/)
            .required(),
        limit: Joi.string().pattern(/^\d+$/).optional(),
    }),

    details: Joi.object().keys({
        id: Joi.string().required(),
    }),

    add_users: Joi.object({
        merchant_id: Joi.string().required(),
        first_name: Joi.string().min(3).required(),
        middle_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        dob: Joi.date().less("1-1-2010").required(),
        email: Joi.string().email().required(),
        mobile: Joi.number().min(11).required(),
        working_hours: Joi.number().required(),
        working_days: Joi.array()
            .items(
                Joi.string().valid("sat", "sun", "mon", "tues", "wed", "thur", "fri")
            )
            .required(),
        role: Joi.string().valid("financial").required(),
    }),
};
