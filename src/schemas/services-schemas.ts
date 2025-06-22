import Joi from "joi";

export const servicesSchemas = {
    createNewServiceSchema: Joi.object({
        service_type: Joi.string().required(),
    }),

    listServicesWithActiveMerchantsSchema: Joi.object({
        page: Joi.number().required().min(-1),
        limit: Joi.number().optional(),
        offset: Joi.number().optional(),
    }),
}