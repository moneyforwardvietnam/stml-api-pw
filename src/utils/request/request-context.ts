import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { allure } from "allure-playwright";
import { HttpMethod } from './http-method';
require('dotenv').config()

export default class RequestContext {
    public context!: APIRequestContext;
    public baseURL;
    public headers: any;

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

    async requestSender<T = unknown>(method: HttpMethod, path: string, options?: { data?: T, form?: any, params?: any }, header?: any): Promise<APIResponse> {
        switch (method) {
            case HttpMethod.GET:
                await allure.label("REQUEST", method + " " + this.baseURL);
                return await this.context.get(path, {
                    params: options?.params,
                    headers: header ? header : this.headers
                })
            case HttpMethod.POST:
                if (options === undefined) {
                    return await this.context.post(path, {
                        headers: header ? header : this.headers
                    })
                } else {
                    return await this.context.post(path, {
                        data: options.data,
                        form: options.form,
                        headers: header ? header : this.headers
                    })
                }
            case HttpMethod.PUT: ;
                if (options === undefined) {
                    return await this.context.put(path, {
                        headers: header ? header : this.headers
                    })
                } else {
                    return await this.context.put(path, {
                        data: options.data,
                        headers: header ? header : this.headers
                    })
                }
            case HttpMethod.DELETE:
                return this.context.delete(path);
            default: throw new Error('Method not implemented');
        }
    }
}
