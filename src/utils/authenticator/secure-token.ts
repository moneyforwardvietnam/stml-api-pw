
import { Buffer } from 'buffer';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { Logger } from '../logger';
import { HttpMethod } from '../request/http-method';
import RequestContext from '../request/request-context';
import { getCode } from './web-apps';
import * as crypto from 'crypto';
import * as fs from 'fs';

const TOKEN_FILE_PATH = path.join(__dirname, '/token/en_token.txt')
const SECRET_KEY_PATH = path.join(__dirname, '/token/secret_key.txt')

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
        const data: string = token + '\n' + expires_in;

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
    return (readFileSync(TOKEN_FILE_PATH).toString('utf-8')).split('\n')[0];
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

function getSecretKey() {
    if (fs.existsSync(SECRET_KEY_PATH)) {
        const key = fs.readFileSync(SECRET_KEY_PATH, 'utf-8');
        const jsonKey = JSON.parse(key);
        return jsonKey;
    }

    const secretKey = crypto.randomBytes(32);
    let iv = Buffer.alloc(16);
    const data = {
        key: secretKey,
        iv: iv
    }
    fs.writeFileSync(SECRET_KEY_PATH, JSON.stringify(data, null, 2));
    return data;
}

function encrypt(text: string): string {
    const jsonKey = JSON.parse(getSecretKey());
    const cipher = crypto.createDecipheriv('aes-256-cbc', jsonKey.key, jsonKey.iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText: string): string {
    const jsonKey = JSON.parse(getSecretKey());
    const decipher = crypto.createDecipheriv('aes-256-cbc', jsonKey.key, jsonKey.iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

