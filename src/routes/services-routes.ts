import { Router } from "express";
import { ServicesController } from "../controllers/services-controller";
import asyncHandler from "../middlewares/asyncWrapper";
import { verifyToken } from "../middlewares/token";
import { validateSchemas } from "../middlewares/validateRequests";
import { servicesSchemas } from "../schemas/services-schemas";

export class ServicesRoutes {
    public router = Router();
    private controller = new ServicesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/list-available-services',
            verifyToken,
            asyncHandler(this.controller.listAllServices)
        )

        this.router.post('/create-new-service',
            validateSchemas(servicesSchemas.createNewServiceSchema),
            verifyToken,
            asyncHandler(this.controller.createNewService)
        )
    }
}