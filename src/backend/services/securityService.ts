import { PasswordResponse } from '@backend/interfaces/serviceTypes';
import util from 'node:util';
import crypto from 'node:crypto';
import { DecryptionResponse, EncryptionResponse } from '@backend/interfaces/securityTypes';

const pbkdf2Async = util.promisify(crypto.pbkdf2);

export const hashPassword = async (unhashedPassword: string) : Promise<PasswordResponse> => {
    
    try {
        const saltBuffer = crypto.randomBytes(16);
        const derivedKeyBuffer = await pbkdf2Async(unhashedPassword, saltBuffer, 310000, 64, 'sha512');
    
        return {
            success: true,
            hashedPassword: derivedKeyBuffer.toString('hex'),
            salt: saltBuffer.toString('hex')
        }
    } catch (error) {
        console.log("[ERROR] ", error);
        return {
            success: false,
            error: "Error generating password hash"
        }
    }

}

export const encryptData =  (data: string, secretKeyBuffer: Buffer) : EncryptionResponse => {

    try {
        const iv = crypto.randomBytes(12);
    
        const cypher = crypto.createCipheriv('aes-256-gcm', secretKeyBuffer, iv);
        let encryptedText = cypher.update(data, 'utf8', 'hex' );
        encryptedText += cypher.final('hex');
    
        const authTag = cypher.getAuthTag();
    
        const encryptedData = `${iv.toString('hex')}:${authTag.toString('hex')}:${encryptedText}`;
    
        return {
            success: true,
            encryptedContent: encryptedData
        }
    } catch (error) {
        console.log("[ERROR] ", error);
        return {
            success: false,
            error: "Data Encryption failed"
        }
    }
}

export const decryptData = (encryptedData: string, secretKeyBuffer: Buffer) : DecryptionResponse => {
    
    try{
        const items: Array<string> = encryptedData.split(':');
        if(items.length !== 3){
            return {
                success: false,
                error: "Error decrypting content"
            }
        }
        const decontructedItems = {
            iv: Buffer.from(items[0], 'hex'),
            authTag: Buffer.from(items[1], 'hex'),
            encryptedContent: items[2]
        }

        const decypher = crypto.createDecipheriv('aes-256-gcm', secretKeyBuffer, decontructedItems.iv);
        decypher.setAuthTag(decontructedItems.authTag);

        let decryptedText = decypher.update(decontructedItems.encryptedContent, 'hex', 'utf8');
        decryptedText += decypher.final('utf8');

        return {
            success: true,
            decryptedContent: decryptedText
        }

    } catch(error){
        console.log("[ERROR] ", error);
        return {
            success: false,
            error: "Error decrypting the content, password invalid or corrupted data"
        }
    }

    

}

export const extractSecreKey = async (unhashedPassword: string, salt: string) => {
    const newSalt = salt + "-encryption";

    return await pbkdf2Async(
        unhashedPassword, newSalt,
        310000, 32, 'sha512'
    )
}

export const checkPassword = async (hashedPassword: string, unhashedPassword: string, salt: string) => {
    const checkPassword = await pbkdf2Async(unhashedPassword, Buffer.from(salt, 'hex'), 310000, 64, 'sha512');
    return checkPassword.toString('hex') === hashedPassword;
}