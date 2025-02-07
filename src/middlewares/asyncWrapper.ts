import { Request, Response, NextFunction } from "express";
import { WebError } from "../utilities/web-errors";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = ( asyncFunc: AsyncFunction ) => {
    return (req: Request, res: Response, next: NextFunction) => {
        asyncFunc(req, res, next).catch((error: any) => {
            if(!(error instanceof WebError)){
                next(WebError.InternalServerError())
            }
            next(error);
        });
    };
};

export default asyncHandler;