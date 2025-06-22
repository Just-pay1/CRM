import { Router } from "express";
import { InternalController } from "../controllers/internal-controller";
import { validateSchemas } from "../middlewares/validateRequests";
import { merchantSchemas } from "../schemas/merchants-schemas";
import asyncHandler from "../middlewares/asyncWrapper";
import { servicesSchemas } from "../schemas/services-schemas";

export class InternalRoutes {
    public router = Router();
    private controller = new InternalController()

    constructor() {
        this.initializeInternalRoutes();
    }

    private initializeInternalRoutes() { 
        this.router.post('/merchant-details',
            validateSchemas(merchantSchemas.details),
            asyncHandler(this.controller.merchantDetails)
        )

        this.router.post('/list-services-with-active-merchants',
            validateSchemas(servicesSchemas.listServicesWithActiveMerchantsSchema),
            asyncHandler(this.controller.getAllServicesWithItsActiveMerchants)
        )
    }
}