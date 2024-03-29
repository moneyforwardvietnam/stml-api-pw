import * as crypto from 'crypto';

function encrypt(text: string, privateKeyHex: string): string {
    const key = Buffer.from(privateKeyHex, 'hex');
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}

console.log(encrypt("Brice@123", "1b9048ca93cc252aca1a35a48a5d99eae6181976a8cf702dc8313762671a1509"));

//run - npx ts-node /Users/mfv-computer-0149/Documents/STML-Automation/qa-auto-pw-api/encrypt_use.ts