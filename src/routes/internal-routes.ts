import { Router } from "express";
import { InternalController } from "../controllers/internal-controller";

export class InternalRoutes {
    public router = Router();
    private controller = new InternalController()

    constructor() {
        this.initializeInternalRoutes();
    }

    private initializeInternalRoutes() { 
        this.router.post('/merchant-details',
            this.controller.merchantDetails
        )
    }
}