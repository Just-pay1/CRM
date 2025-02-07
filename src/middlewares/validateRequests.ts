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