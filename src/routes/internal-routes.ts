import { Router } from "express";
import { InternalController } from "../controllers/internal-controller";
import { validateSchemas } from "../middlewares/validateRequests";
import { merchantSchemas } from "../schemas/merchants-schemas";

export class InternalRoutes {
    public router = Router();
    private controller = new InternalController()

    constructor() {
        this.initializeInternalRoutes();
    }

    private initializeInternalRoutes() { 
        this.router.post('/merchant-details',
            validateSchemas(merchantSchemas.details),
            this.controller.merchantDetails
        )
    }
}