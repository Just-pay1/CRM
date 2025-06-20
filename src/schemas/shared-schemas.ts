import Joi from "joi";

export const listSchema = Joi.object(
    {
        page: Joi.string().pattern(/^(?:0|[1-9][0-9]*|-1)$/).required(),
        limit: Joi.string().pattern(/^\d+$/).optional(),
    }
)

export const detailsSchema = Joi.object(
    {
        id: Joi.string().required()
    }
)