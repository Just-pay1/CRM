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
    
        license_issue_date: Joi.string().required(), // Keep as string for form_data
        license_exp_date: Joi.string().required().custom((value, helpers) => {
            const issueDate = helpers.state.ancestors[0].license_issue_date;
            if (issueDate && value) {
                const issue = new Date(issueDate);
                const expiry = new Date(value);
                if (expiry <= issue) {
                    return helpers.error('any.invalid');
                }
            }
            return value;
        }, 'License Expiry Date'),
    
        tax_id_number: Joi.string().length(9).pattern(/^\d+$/).required(),
    
        telephone_number: Joi.string()
          .max(12)
          .pattern(/^\+\d+$/)
          .required(),
    
        admin_email: Joi.string().email().required(),
    
        business_type: Joi.string().required(),
    
        bank_name: Joi.string().required(),
        account_holder_name: Joi.string().required(),
        account_type: Joi.string().required(),
        account_number: Joi.string().pattern(/^\d+$/).length(16).required(),
    
        iban: Joi.string().allow(null, '').required(),
        swift: Joi.string().allow(null, '').required(),
    
        settlement_period: Joi.string().required(),
        settlement_time: Joi.string()
          .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
          .required(), // Ensures HH:mm format
    
        commission_setup: Joi.string().valid('Fixed', 'Percentage').required(),
        commission_amount: Joi.string()
          .pattern(/^\d+(\.\d+)?$/)
          .required()
          .custom((value, helpers) => {
            const num = parseFloat(value);
            if (num < 0 || num > 100) {
              return helpers.error('any.invalid');
            }
            return value; // Return string for form_data
          }, 'Commission Amount'),
    
        longitude: Joi.string().required(),
        latitude: Joi.string().required(),
    
        fee_from: Joi.string().valid('user', 'merchant').required().default('merchant'),
        service_id: Joi.string().required(),
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
        mobile: Joi.string().length(11).required(),
        working_hours: Joi.number().required(),
        working_days: Joi.array()
            .items(
                Joi.string().valid("sat", "sun", "mon", "tues", "wed", "thur", "fri")
            )
            .required(),
        role: Joi.string().valid("financial").required(),
    }),

    listUsers: Joi.object({
        id: Joi.string().required(),
        page: Joi.number().min(-1).required(),
        limit: Joi.number().min(5).default(10).optional(),
    }),

    uploadlicense: Joi.object({
        id: Joi.string().required(),
    }),

    uploadcommercial_reg: Joi.object({
        id: Joi.string().required(),
    }),

    get_file_urls: Joi.object({
        id: Joi.string().required(),
    }),
};