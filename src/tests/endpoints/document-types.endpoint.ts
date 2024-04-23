import AuthedRequest from "../../utils/request/authed-request";
import {HttpMethod} from "../../utils/request/http-method";


const DOCUMENT_TYPES = '/v1/document_types'

export default class DocumentTypesEndpoint extends AuthedRequest {
    getDocumentTypes = async () => {
        await this.initContext();
        return await this.requestSender(HttpMethod.GET, DOCUMENT_TYPES);
    }
}
