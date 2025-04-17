import { Router } from "express";
import { verifyToken } from "../middlewares/token";
import { validateSchemas } from "../middlewares/validateRequests";
import asyncHandler from "../middlewares/asyncWrapper";
import { MerchantController } from "../controllers/merchant-controller";
import { merchantSchemas } from "../schemas/merchants-schemas";

export class MerchantRoutes {
    public router = Router();
    private controller = new MerchantController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`/create`,
            validateSchemas(merchantSchemas.create_new),
            verifyToken,
            asyncHandler(this.controller.createNewCustomer)
        );

        this.router.get('/list',
            validateSchemas(merchantSchemas.list, 'query'),
            verifyToken,
            asyncHandler(this.controller.getAllMerchants)
        );

        this.router.get('/details',
            validateSchemas(merchantSchemas.details, 'query'),
            verifyToken,
            asyncHandler(this.controller.getMerchantDetails)
        );

        this.router.post('/financial-approve',
            validateSchemas(merchantSchemas.details),
            verifyToken,
            asyncHandler(this.controller.financialApprove)
        );

        this.router.post('/operation-approve',
            validateSchemas(merchantSchemas.details),
            verifyToken,
            asyncHandler(this.controller.operationApprove)
        );

        this.router.post('/add-users',
            validateSchemas(merchantSchemas.add_users),
            verifyToken,
            asyncHandler(this.controller.addUserToMerchant)
        );
    }
}
