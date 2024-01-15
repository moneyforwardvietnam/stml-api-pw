import { getToken } from '../authenticator/secure-token';
import RequestContext from './request-context';

export default class AuthenRequest extends RequestContext {
    constructor() {
        super(process.env.BASE_URI);
    }
    initContext = async () => {
        const token = await getToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        await this.setHeader(headers);
        const context = await this.initialize();
        return context;
    }
}
