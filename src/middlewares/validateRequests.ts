import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from "joi";
import { WebError } from "../utilities/web-errors";

export const validateSchemas =
    (schema: ObjectSchema, type: 'body' | 'query' | 'params' | 'headers' = 'body') =>
        (req: Request, res: Response, next: NextFunction) => {
            const { error, value } = schema.validate(req[type], { abortEarly: false });

            if (!error) {
                req[type] = value;
                return next();
            }

            const { details } = error;
            const message = details.map((d: any) => d.message.replace(/['"]+/g, '')).join(',');
            throw WebError.BadRequest(`${message}, Please review.` || 'Invalid data, Please review.')
        };

export const validateFormData =
    (schema: ObjectSchema) =>
        (req: Request, res: Response, next: NextFunction) => {
            // For form_data, we need to validate the body after multer processes it
            const { error, value } = schema.validate(req.body, { abortEarly: false });

            if (!error) {
                req.body = value;
                return next();
            }

            const { details } = error;
            const message = details.map((d: any) => d.message.replace(/['"]+/g, '')).join(',');
            throw WebError.BadRequest(`${message}, Please review.` || 'Invalid data, Please review.')
        };