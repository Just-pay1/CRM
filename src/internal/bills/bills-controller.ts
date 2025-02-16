import { responseHandler } from "../../utilities/api-response";
import { BillsService } from "./bills-service";
import { Request, Response, NextFunction } from 'express'; 

export class BillsController {
    private service: BillsService  

    constructor() {
        this.service = new BillsService();
    }

    public getUserBill = async (req: Request, res: Response, next: NextFunction) => {
        const bill = await this.service.getUserBill();
        responseHandler(res, 201, 'User bill fetched successfully!', bill)
    }
}