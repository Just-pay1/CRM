import { Request, Response, NextFunction } from 'express';
import { ServicesService } from "../services/services-service";
import { responseHandler } from "../utilities/api-response";

export class ServicesController {
    private service: ServicesService;

    constructor() {
        this.service = new ServicesService();
    }

    public listAllServices = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.listAllServices();
        responseHandler(res, 200, 'All services listed successfully!', response);
    }

    public createNewService = async (req: Request, res: Response, next: NextFunction) => {
        const service_type = req.body.service_type;
        const response = await this.service.createNewService(service_type);
        responseHandler(res, 200, 'New service created successfully!', response);
    }
}