import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { MERCHANT_URL, CORE_URL, MOBILE_URL } from "../config";
import { WebError } from "./web-errors";

export const makeRequest = async (args: {
    method?: 'get' | 'post' | 'put' | 'delete';
    service?: 'core' | 'merchant' | 'mobile';
    path: string;
    context?: object;
    headers?: AxiosRequestHeaders;
}): Promise<any> => {
    try {
        const { method = 'post', service = 'core', path, context = {}, headers = {} } = args;
        const serviceUrl = {
            merchant: MERCHANT_URL,
            core: CORE_URL,
            mobile: MOBILE_URL,
        }[service];

        console.log(`${serviceUrl}/${path}`)

        const { data } = await axios({
            method,
            url: encodeURI(`${serviceUrl}/${path}`),
            data: context,
            headers
        });

        // console.log(data)

        return data.data
    } catch (e: AxiosError | any) {
        // console.log(e.response.data)
        throw WebError.InternalServerError(`Internal server error, ${e.response.data.message}`)
    }
}

