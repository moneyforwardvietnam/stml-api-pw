import { Buffer } from 'buffer';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { Logger } from '../logger';
import { HttpMethod } from '../request/http-method';
import RequestContext from '../request/request-context';
import * as crypto from 'crypto';
import { getCode } from './web-apps';
import { credentials } from './credentials';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

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
                'redirect_uri': process.env.REDIRECT_URI
            }
            const response = await this.requestSender(HttpMethod.POST, "/token", { form: form });
            const jsonData = await response.json();
            const token: string = jsonData.access_token;
            const expires_in: string = (await convertExpiration(jsonData.expires_in)).toString();
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
        const key = getPrivateKey();
        const codePassword = decrypt(credential.codePassword, key);
        const appCode = await getCode(credential.clientId, credential.codeUsername, codePassword);
        const instance = new GetToken(id);
        return await instance.post(appCode, credential.clientId, credential.clientSecret);
    } else {
        return await readToken(id);
    }
}

const readToken = async (id: string) => {
    Logger.info(`Request is using token #${id}`)
    return (readFileSync(getTokenFilePath(id)).toString('utf-8')).split('\n')[0];
}

const isTokenExpired = async (id: string) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    try {
        const expiration = parseInt(readFileSync(getTokenFilePath(id)).toString('utf-8').split('\n')[1]);
        return expiration < currentTimestamp;
    } catch {
        return true;
    }
}

const convertExpiration = async (expiration: any) => {
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

// function encrypt(text: string, privateKeyHex:string): string {
//     const key = Buffer.from(privateKeyHex, 'hex');
//     const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
//     const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return iv.toString('hex') + encrypted;
// }

function decrypt(encryptedText: string, privateKeyHex: string): string {
    const key = Buffer.from(privateKeyHex, 'hex');
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    const encryptedData = encryptedText.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


function getPrivateKey(): string {
    if (fs.existsSync('.env')) {
        dotenv.config();
        const privateKey = process.env.PRIVATE_KEY;
        if (privateKey) {
            return privateKey;
        } else {
            Logger.error('PRIVATE_KEY is not defined in the .env file.');
            return "";
        }
    } else {
        console.error('The .env file does not exist.');
        return "";
    }
}

// function generateAES256Key() {
//      console.log(crypto.randomBytes(32).toString('hex'));
// }