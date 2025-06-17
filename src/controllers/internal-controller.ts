import { Request, Response, NextFunction } from 'express';
import { responseHandler } from "../utilities/api-response";
import { InternalService } from '../services/internal-service';

export class InternalController {
   private service: InternalService;
   
   constructor() {
    this.service = new InternalService();
   }

   public merchantDetails = async (req: Request, res: Response, next: NextFunction) => {
    const response = await this.service.getDetails(req.body.id);
    responseHandler(res, 200, 'Merchant details fetched successfully!', response)
   }

}