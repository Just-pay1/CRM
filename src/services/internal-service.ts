import { Merchant } from "../models/merchant-model";
import { Service } from "../models/services-model";
import { WebError } from "../utilities/web-errors";

export class InternalService {
    async getDetails(id: any) {
        const merchant = await Merchant.findByPk(id);
        if (!merchant || !merchant.dataValues.is_live) {
            throw WebError.BadRequest(`invalid merchant id, please review.`);
        }
        const response = {
            ...merchant.dataValues,
        };
        return response;
    }

    async getAllServicesWithItsActiveMerchants(context: any) {
        const { page, limit, offset } = context;
        const includeMerchants = {
            model: Merchant,
            as: 'merchants',
            where: {
                is_live: true
            },
            attributes: ['id', 'commercial_name'],
            required: false 
        }
        let options: any = {
            distinct: true,
            subQuery: false,
            include: [includeMerchants],
          
        }
        if (page !== -1) {
            options.limit = limit;
            options.offset = offset;
        }

        const { count, rows } = await Service.findAndCountAll(options);
        const response = {
            count,
            activePage: page,
            rows
        }
        return response
    }


}
