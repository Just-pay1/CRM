import { MerchantService } from "../services/merchant-service";
import { Request, Response, NextFunction } from 'express';
import { responseHandler } from "../utilities/api-response";

export class MerchantController {
    private service: MerchantService;

    constructor() {
        this.service = new MerchantService();
    }

    public createNewCustomer = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.createNewCustomer(req.body);
        responseHandler(res, 200, 'Request to create a new Merchant Profile is submitted!', response)
    }

    public getAllMerchants = async (req: Request, res: Response, next: NextFunction) => {
        const list = await this.service.listAllMerchnts(req);
        responseHandler(res, 200, 'All merchants listed successfully!', list)
    }

    public getMerchantDetails = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            id: req.query.id,
            user: req.body.user
        }
        const response = await this.service.getDetails(data);
        responseHandler(res, 200, 'Merchants details fetched successfully!', response)
    }

    public financialApprove = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.financialApprove(req.body);
        responseHandler(res, 200, 'Approverd successfully!', response)
    }

    public operationApprove = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.operationApprove(req.body);
        responseHandler(res, 200, 'Approverd successfully!', response)
    }

    public addUserToMerchant = async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.addUserToMerchant(req.body);
        responseHandler(res, 200, 'User added to the merchant successfully!', response)
    }

    public listUsers = async (req: Request, res: Response, next: NextFunction) => {
        const page = +req.query.page! === 0 ? 1 : +req.query.page!;
        const limit = +req.query.limit!;
        const id = req.body.id
        const list = await this.service.listUsers(id, page, limit);
    }

    public listAllServices = async (req: Request, res: Response, next: NextFunction) => {
        const list = await this.service.listAllServices();
        responseHandler(res, 200, 'All services listed successfully!', list)
    }
}