import {Buffer} from "buffer";
import crypto from "crypto";

function encrypt(text: string, privateKeyHex: string): string {
    const key = Buffer.from(privateKeyHex, 'hex');
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}

function generateAES256Key() {
    return crypto.randomBytes(32).toString('hex');
}


console.log("New key: " + generateAES256Key());
console.log("Encrypted " + process.argv[2] + " to: " + encrypt(process.argv[2], process.argv[3]))