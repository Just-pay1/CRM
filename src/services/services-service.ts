import { Service } from "../models/services-model";
import { makeRequest } from "../utilities/makeInternalRequest";
import { WebError } from "../utilities/web-errors";

export class ServicesService {

        async listAllServices() {
            const { count, rows } = await Service.findAndCountAll({ order: [['createdAt', 'DESC']] })
            const response = {
                count,
                rows
            }
            return response
        }

        async serviceDetails(service_id: string) {
            const service = await Service.findByPk(service_id)
            if(!service){
                throw WebError.BadRequest('invalid service_id, please review.')
            }
            return service;
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