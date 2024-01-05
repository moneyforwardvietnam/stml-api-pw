var randomstring = require("randomstring");
export class Random {
    static async id(): Promise<string> {
        return 'atid' + randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
    }
}