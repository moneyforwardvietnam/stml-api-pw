export interface Credentials {
    clientId: string;
    clientSecret: string;
    codeUsername: string;
    codePassword: string;
    email: string;
    officeId: string;
}

export const credentials: { [id: string]: Credentials } = {
    "0": {
        clientId: process.env.CLIENT_ID_1 ?? "",
        clientSecret: process.env.CLIENT_SECRET_1 ?? "",
        codeUsername: process.env.CODE_USERNAME_1 ?? "",
        codePassword: process.env.CODE_PASSWORD_1 ?? "",
        email: process.env.EMAIL_1 ?? "",
        officeId: process.env.OFFICE_ID_1 ?? ""
    },
    "1": {
        clientId: process.env.CLIENT_ID_2 ?? "",
        clientSecret: process.env.CLIENT_SECRET_2 ?? "",
        codeUsername: process.env.CODE_USERNAME_2 ?? "",
        codePassword: process.env.CODE_PASSWORD_2 ?? "",
        email: process.env.EMAIL_2 ?? "",
        officeId: process.env.OFFICE_ID_2 ?? ""
    },
    "2": {
        clientId: process.env.CLIENT_ID_3 ?? "",
        clientSecret: process.env.CLIENT_SECRET_3 ?? "",
        codeUsername: process.env.CODE_USERNAME_3 ?? "",
        codePassword: process.env.CODE_PASSWORD_3 ?? "",
        email: process.env.EMAIL_3 ?? "",
        officeId: process.env.OFFICE_ID_3 ?? ""
    },
    "3": {
        clientId: process.env.CLIENT_ID_4 ?? "",
        clientSecret: process.env.CLIENT_SECRET_4 ?? "",
        codeUsername: process.env.CODE_USERNAME_4 ?? "",
        codePassword: process.env.CODE_PASSWORD_4 ?? "",
        email: process.env.EMAIL_4 ?? "",
        officeId: process.env.OFFICE_ID_4 ?? ""
    },
    "4": {
        clientId: process.env.CLIENT_ID_5 ?? "",
        clientSecret: process.env.CLIENT_SECRET_5 ?? "",
        codeUsername: process.env.CODE_USERNAME_5 ?? "",
        codePassword: process.env.CODE_PASSWORD_5 ?? "",
        email: process.env.EMAIL_5 ?? "",
        officeId: process.env.OFFICE_ID_5 ?? ""
    }
};