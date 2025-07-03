import Joi from "joi";
import { userCreateFormData } from "./user-schemas";
import { join } from "path";

const fileSchema = Joi.object({
    fieldname: Joi.string().valid('license_url', 'commercial_reg_url').required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg', 'application/pdf').required(),
    size: Joi.number().max(3 * 1024 * 1024).required(), // 5MB max
    buffer: Joi.any(),
  });

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
        license_url: Joi.array().items(fileSchema).length(1).required(),
        commercial_reg_url: Joi.array().items(fileSchema).length(1).required(),
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

    addUserToMerchantFormData: userCreateFormData.keys({
        merchant_id: Joi.string().required()
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