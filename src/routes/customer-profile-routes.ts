import { Router } from "express";
import { verifyToken } from "../middlewares/token";
import { validateSchemas } from "../middlewares/validateRequests";
import asyncHandler from "../middlewares/asyncWrapper";
import { CustomerProfileController } from "../controllers/customer-profile-controller";

export class CustomerProfileRoutes {
    public router = Router();
    private controller = new CustomerProfileController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`/create`,
            // validateSchemas(),
            verifyToken,
            asyncHandler(this.controller.createNewCustomer)
        )
    }
}
