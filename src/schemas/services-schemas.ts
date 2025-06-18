import Joi from "joi";

export const servicesSchemas = {
    createNewServiceSchema: Joi.object({
        service_type: Joi.string().required(),
    })
}