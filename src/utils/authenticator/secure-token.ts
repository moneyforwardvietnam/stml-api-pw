
import { Buffer } from 'buffer';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { Logger } from '../logger';
import { HttpMethod } from '../request/http-method';
import RequestContext from '../request/request-context';
import { getCode } from './web-apps';

const TOKEN_FILE_PATH = path.join(__dirname, '/token/token.txt')

let client_id = process.env.CLIENT_ID_1 ?? ""
let client_secret = process.env.CLIENT_SECRET_1 ?? ""
let code_username = process.env.CODE_USERNAME_1 ?? ""
let code_password = process.env.CODE_PASSWORD_1 ?? ""

export default class GetToken extends RequestContext {
    constructor() {
        super(process.env.BASE_TOKEN)
    }

    post = async (appCode: any, username: string, password: string) => {
        const basicAuth = await generateBasicAuthHeader(username, password);
        const headers = {
            'Authorization': basicAuth,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        await this.setHeader(headers)
        await this.initialize();
        const form = {
            'code': appCode,
            'grant_type': 'authorization_code',
            'redirect_uri': process.env.REDIRECT_URL
        }
        const response = await this.requestSender(HttpMethod.POST, "/token", { form: form });
        const jsonData = await response.json();
        const token: string = jsonData.access_token;
        const expires_in: string = (await converExpiration(jsonData.expires_in)).toString();
        const data = token + '\n' + expires_in;
        writeFileSync(TOKEN_FILE_PATH, data, {
            flag: 'w',
        });
        return token;
    }

}

export async function getToken() {
    if (await isTokenExpired()) {
        Logger.info('Token is expired. Getting new token!')
        const appCode = await getCode(client_id, code_username, code_password);
        const instance = new GetToken;
        return await instance.post(appCode, client_id, client_secret);
    } else {
        return await readToken();
    }
}

const readToken = async () => {
    return readFileSync(TOKEN_FILE_PATH).toString('utf-8').split('\n')[0];
}

const isTokenExpired = async () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    try {
        const expiration = parseInt(readFileSync(TOKEN_FILE_PATH).toString('utf-8').split('\n')[1]);
        return expiration < currentTimestamp;
    } catch {
        return true;
    }
}

const converExpiration = async (expiration: any) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return currentTimestamp + Math.floor(expiration);
}

const generateBasicAuthHeader = async (username: string, password: string): Promise<string> => {
    const credentials = username + ":" + password;
    const credentialsBytes = Buffer.from(credentials, 'utf-8');
    const encodedCredentials = credentialsBytes.toString('base64');
    return "Basic " + encodedCredentials;
}
