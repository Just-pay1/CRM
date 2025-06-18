import { makeRequest } from "../utilities/makeInternalRequest";

export class ServicesService {

        async listAllServices() {
            const response = await makeRequest({
                method: 'post',
                path: 'services/list-all-services',
                service: 'billing',
            })
            return response;
        }

        async createNewService(service_type: string) {
            const response = await makeRequest({
                method: 'post',
                path: 'services/create-new-service',
                service: 'billing',
                context: { service_type}
            })

            return response;
        }

}