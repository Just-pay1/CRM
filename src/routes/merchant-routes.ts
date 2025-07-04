import { Router } from "express";
import { verifyToken } from "../middlewares/token";
import { validateSchemas, validateFormData } from "../middlewares/validateRequests";
import asyncHandler from "../middlewares/asyncWrapper";
import { MerchantController } from "../controllers/merchant-controller";
import { merchantSchemas } from "../schemas/merchants-schemas";
import multer from "multer";

export class MerchantRoutes {
    public router = Router();
    private controller = new MerchantController();
    private upload = multer();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`/create`,
            this.upload.fields([{ name: 'license_url'}, { name: 'commercial_reg_url'}]),
            validateFormData(merchantSchemas.create_new),
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
            verifyToken,
            this.upload.single('image'),
            validateFormData(merchantSchemas.addUserToMerchantFormData),
            asyncHandler(this.controller.addUserToMerchant)
        );

        this.router.get('/list-merchant-users', 
            validateSchemas(merchantSchemas.listUsers, 'query'),
            verifyToken,
            asyncHandler(this.controller.listUsers)
        );
    }
}