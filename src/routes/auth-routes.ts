import { Router } from "express";
import AuthController from "../controllers/auth-controller";
import asyncHandler from "../middlewares/asyncWrapper";
import { validateSchemas } from "../middlewares/validateRequests";
import { authSchemas } from "../schemas/auth-schemas";
import { verifyToken } from "../middlewares/token";


class AuthRoutes {
    public router = Router();
    private controller = new AuthController()

    constructor() {
        this.initializeUserRoutes();
    }

    private initializeUserRoutes() {

        this.router.post('/login', 
            validateSchemas(authSchemas.loginSchema), 
            asyncHandler(this.controller.handleLoginReq)
        )

        this.router.post('/reset-password',
            validateSchemas(authSchemas.rest_password_schema),
            asyncHandler(this.controller.resetPassword)
        )

        this.router.post('/forget-password',
            validateSchemas(authSchemas.forget_password_schema),
            asyncHandler(this.controller.forgetPassword)
        )

        this.router.post('/set-pincode',
            validateSchemas(authSchemas.set_pincode_schema),
            verifyToken,
            asyncHandler(this.controller.setPinCode)
        )

        this.router.post('/confirm-pincode',
            validateSchemas(authSchemas.confirm_pincode_schema),
            verifyToken,
            asyncHandler(this.controller.confirmPinCode)
        )


        // profile management 

        this.router.post('/change-password',
            validateSchemas(authSchemas.change_password_schema),
            verifyToken,
            asyncHandler(this.controller.changePassword)
        )

        this.router.post('/change-pin-code',
            validateSchemas(authSchemas.change_pincode_schema),
            verifyToken,
            asyncHandler(this.controller.chnagePinCode)
        )

        this.router.post('/logout',
            verifyToken,
            asyncHandler(this.controller.logout)
        )

    }
}

export default AuthRoutes;