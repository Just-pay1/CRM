import { Merchant } from "../models/merchant-model";
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
}
