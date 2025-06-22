import { Service } from "../models/services-model";
import { makeRequest } from "../utilities/makeInternalRequest";
import { WebError } from "../utilities/web-errors";

export class ServicesService {

        async listAllServices() {
            const { count, rows } = await Service.findAndCountAll()
            const response = {
                count,
                rows
            }
            return response
        }

        async createNewService(service_type: string) {
            const oldService = await Service.findOne({ where: { service_type } })

            if(oldService){
                throw WebError.BadRequest(`This service already exists, please review.`)
            }
    
            const newService = await Service.create({
                service_type
            });
    
            return newService.dataValues;
        }

}