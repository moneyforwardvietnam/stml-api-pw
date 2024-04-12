import {APIRequestContext, APIResponse, request} from '@playwright/test';
import {allure} from "allure-playwright";
import {HttpMethod} from './http-method';
import {ScenarioContext} from "../../tests/context/scenario-context";

require('dotenv').config()

export default class RequestContext {
    public context!: APIRequestContext;
    public baseURL;
    public headers: any;
    public sharedData!: ScenarioContext;

    constructor(baseURL: any) {
        this.baseURL = baseURL;
    }

    async setHeader(headers: any) {
        this.headers = headers
    }

    async setSharedData(sharedData: ScenarioContext) {
        this.sharedData = sharedData;
    }

    async initialize() {
        this.context = await request.newContext({
            baseURL: this.baseURL,
            extraHTTPHeaders: this.headers
        });
    }

    async requestSender<T = unknown>(method: HttpMethod, path: string, options?: {
        data?: T,
        form?: any,
        params?: any,
        multipart?: T;
    }, header?: any): Promise<APIResponse> {
        const response = await this.request(method, path, options, header);
        try {
            await allure.logStep("Headers: " + JSON.stringify(this.headers))
            if (options) {
                await allure.logStep("Options: " + JSON.stringify(options));
            }
            await allure.logStep("Status code: " + response.status() + " - " + response.statusText());
            await allure.logStep("Response body: " + await response.body());
        } catch {
            //ignored
        }
        return response;
    }

    async requestFetch<T = unknown>(method: string, path: string, options?: {
        data?: T,
        form?: any,
        params?: any,
        multipart?: T;
    }, header?: any): Promise<APIResponse> {
        const response = await this.fetch(method, path, options, header);
        try {
            await allure.logStep("Headers: " + JSON.stringify(this.headers))
            if (options) {
                await allure.logStep("Options: " + JSON.stringify(options));
            }
            await allure.logStep("Status code: " + response.status() + " - " + response.statusText());
            await allure.logStep("Response body: " + await response.body());
        } catch {
            //ignored
        }
        return response;
    }

    async request<T = unknown>(method: HttpMethod, path: string, options?: {
        data?: T,
        form?: any,
        params?: any,
        multipart?: any;
    }, header?: any): Promise<APIResponse> {
        let response;
        const headers = {...this.headers, ...header};
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
                        multipart: options.multipart,
                        form: options.form,
                        headers: headers
                    })
                }
                break;
            case HttpMethod.PUT:
                if (options === undefined) {
                    response = await this.context.put(path, {
                        headers: headers,
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
            default:
                throw new Error('Method not implemented');
        }
        return response;
    }

    async fetch<T = unknown>(method: string, path: string, options?: {
        data?: T,
        form?: any,
        params?: any,
        multipart?: any;
    }, header?: any): Promise<APIResponse> {
        let response;
        const headers = {...this.headers, ...header};

        if (options === undefined) {
            response = await this.context.fetch(path, {
                method: method.toLowerCase(),
                headers: headers,
            })
        } else {
            response = await this.context.fetch(path, {
                method: method.toLowerCase(),
                headers: headers,
                multipart: options.multipart
            })
        }
        return response;
    }
}