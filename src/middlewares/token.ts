import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { WebError } from '../utilities/web-errors';
import { User } from '../models/user-model';
import { JWT_SECRET_KEY } from '../config';


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization || req.headers.Authorization;

        if (!token) {
            throw new WebError(401, 'MissingTokenError', 'Missing authentication token, please login first');
        }

        let decodedToken: any
        try {
            decodedToken = jwt.verify(token.toString(), JWT_SECRET_KEY!) as JwtPayload;
        } catch (err) {
            throw new WebError(401, 'InvalidTokenError', 'The provided token is invalid or expired, please login first');
        }

        // console.log(decodedToken);

        const user = await User.findOne({ where: { activeTokenID: decodedToken.activeTokenID } });

        if (!user) {
            throw WebError.UnAuthorized('Forbidden, you are not authorized');
        }

        req.body.user = decodedToken;
        // console.log(req.body.user, '===============')
        next();
    } catch (error) {
        next(error);
    }
};


export const generateToken = (payload: any) => {
    if(JWT_SECRET_KEY){
        return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1h" });
    }else{
        throw WebError.InternalServerError()
    }
};