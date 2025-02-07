import AuthService from "../services/auth-service";
import { Request, Response, NextFunction } from 'express'; 
import { responseHandler } from "../utilities/api-response";

class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService()
    }

    public handleLoginReq = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.login(req);
        responseHandler(res, 200, 'User Logged in successfully!', response)
    }

    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.resetPassword(req.body)
        responseHandler(res, 200, 'User password updated successfully!', response)
    }

    public forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email
        let response = await this.service.forgetPassword(email)
        responseHandler(res, 200, 'A mail was sent to your email with a reset link, please check your mail.', response)
    }

    public setPinCode = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            pinCode: req.body.pinCode,
            confirmedPinCode: req.body.confirmedPinCode,
            currenctUser: req.body.user,
        }
        let response = await this.service.setPinCode(data)
        
        responseHandler(res, 200, 'User pin code set successfully!', response)
    }

    public confirmPinCode = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            pinCode: req.body.pinCode,
            currentUser: req.body.user
        }
        let response = await this.service.confirmPinCode(data)
        responseHandler(res, 200, 'Pin code confirmed successfully!', response)
    }

    // profile management

    public changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword,
            confirmedPassword: req.body.confirmedPassword,
            currentUser: req.body.user
        };

        let response = await this.service.changePassword(data)
        responseHandler(res, 200, 'User password updated successfully!', response)
    }

    public chnagePinCode = async (req: Request, res: Response, next: NextFunction) => {
        let data = {
            oldPinCode: req.body.oldPinCode,
            newPinCode: req.body.newPinCode,
            confirmedPinCode: req.body.confirmedPinCode,
            currentUser: req.body.user,
        }

        let response = await this.service.chnagePinCode(data)
        responseHandler(res, 200, 'User pin code updated successfully', response)
    }

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        let response = this.service.logout(req.body.user);
        responseHandler(res, 200, 'User logged out successfully', response)
    }


}

export default AuthController;