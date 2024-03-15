import {Buffer} from 'buffer';
import {readFileSync, writeFileSync} from 'fs';
import * as path from 'path';
import {Logger} from '../logger';
import {HttpMethod} from '../request/http-method';
import RequestContext from '../request/request-context';
import {getCode} from './web-apps';
import {credentials} from './credentials';

const TOKENS_DIRECTORY = path.join(__dirname, '/token');
class GetToken extends RequestContext {
    constructor(private id: string) {
        super(process.env.BASE_TOKEN)
    }

    post = async (appCode: any, username: string, password: string) => {
        try {
            const tokenFilePath = path.join(TOKENS_DIRECTORY, `${this.id}_token.txt`);
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
            const response = await this.requestSender(HttpMethod.POST, "/token", {form: form});
            const jsonData = await response.json();
            const token: string = jsonData.access_token;
            const expires_in: string = (await converExpiration(jsonData.expires_in)).toString();
            const data: string = token + '\n' + expires_in;

            writeFileSync(tokenFilePath, data, {
                flag: 'w',
            });
            return token;
        } catch (error) {
            Logger.error(`Error occurred while getting token: ${error}`);
            return undefined;
        }

    }

}

export async function getToken(id: string) {
    const credential = credentials[id];
    if (!credential) {
        Logger.error(`Credentials not found for id ${id}`);
        return undefined;
    }
    if (await isTokenExpired(id)) {
        Logger.info(`Token ${id} is expired. Getting new token!`)
        const appCode = await getCode(credential.clientId, credential.codeUsername, credential.codePassword);
        const instance = new GetToken(id);
        return await instance.post(appCode, credential.clientId, credential.clientSecret);
    } else {
        return await readToken(id);
    }
}

const readToken = async (id:string) => {
    Logger.info(`Using token ${id}`)
    return (readFileSync(getTokenFilePath(id)).toString('utf-8')).split('\n')[0];
}

const isTokenExpired = async (id:string) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    try {
        const expiration = parseInt(readFileSync(getTokenFilePath(id)).toString('utf-8').split('\n')[1]);
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


function getTokenFilePath(id: any) {
    return path.join(TOKENS_DIRECTORY, `${id}_token.txt`);
}

