import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { allure } from "allure-playwright";
import { HttpMethod } from './http-method';
import { ScenarioContext } from '../../tests/context/scenario-context';
require('dotenv').config()

export default class RequestContext {
    public context!: APIRequestContext;
    public baseURL;
    public headers: any;
    public sharedData = ScenarioContext.getInstance();

    constructor(baseURL: any) {
        this.baseURL = baseURL;
    }

    async setHeader(headers: any) {
        this.headers = headers
    }

    async initialize() {
        const context = await request.newContext({
            baseURL: this.baseURL,
            extraHTTPHeaders: this.headers
        })
        this.context = context;
    }

    // async requestSender<T = unknown>(method: HttpMethod, path: string, options?: { data?: T, form?: any, params?: any }, header?: any): Promise<APIResponse> {
    //     const response = await this.request(method, path, options, header);
    //     allure.logStep("Response: " + response.json());
    //     return response;
    // }

    async requestSender<T = unknown>(method: HttpMethod, path: string, options?: { data?: T, form?: any, params?: any }, header?: any): Promise<APIResponse> {
        let response;
        const headers = header ? header : this.headers;
        switch (method) {
            case HttpMethod.GET:
                response = await this.context.get(path, {
                    params: options?.params,
                    headers: headers
                })
                break;
            case HttpMethod.POST:
                if (options === undefined) {
                    response = await this.context.post(path, {
                        headers: headers
                    })
                } else {
                    response = await this.context.post(path, {
                        data: options.data,
                        form: options.form,
                        headers: headers
                    })
                }
                break;
            case HttpMethod.PUT: ;
                if (options === undefined) {
                    response = await this.context.put(path, {
                        headers: headers
                    })
                } else {
                    response = await this.context.put(path, {
                        data: options.data,
                        headers: headers
                    })
                }
                break;
            case HttpMethod.DELETE:
                response = this.context.delete(path);
                break;
            default: throw new Error('Method not implemented');
        }

        try {
            allure.logStep("Headers: " + JSON.stringify(headers))
            if (options) {
                allure.logStep("Options: " + JSON.stringify(options));
            }
            allure.logStep("Request: " + JSON.stringify(response));
        } catch { }


        return response;
    }
}
