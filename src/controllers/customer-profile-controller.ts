import { CustomerService } from "../services/customer-profile-service";
import { Request, Response, NextFunction } from 'express'; 
import { responseHandler } from "../utilities/api-response";

export class CustomerProfileController {
    private service: CustomerService;

    constructor() {
        this.service = new CustomerService();
    }

    public createNewCustomer =  async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.service.createNewCustomer(req.body);
        responseHandler(res, 200, 'Request to create a new Customer Profile is submitted!', response)
    }
}