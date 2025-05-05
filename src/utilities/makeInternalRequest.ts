import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { MERCHANT_URL, BILLING_URL } from "../config";
import { WebError } from "./web-errors";

export const makeRequest = async (args: {
    method?: 'get' | 'post' | 'put' | 'delete';
    service?: 'merchant' | 'billing';
    path: string;
    context?: object;
    headers?: AxiosRequestHeaders;
}): Promise<any> => {
    try {
        const { method = 'post', service = 'merchant', path, context = {}, headers = {} } = args;
        const serviceUrl = {
            merchant: MERCHANT_URL,
            billing: BILLING_URL,
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

