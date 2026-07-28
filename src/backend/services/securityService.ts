/**
 * Security service managing cryptographic operations including password hashing,
 * key derivation via PBKDF2, and AES-256-GCM symmetric encryption/decryption.
 * 
 * @module SecurityService
 */

import util from 'node:util';
import crypto from 'node:crypto';
import { DecryptionResponse, EncryptionResponse, PasswordResponse } from '@backend/interfaces/securityTypes';
import { logger } from '../util/logger';


const pbkdf2Async = util.promisify(crypto.pbkdf2);

/**
 * Hashes a plaintext password using PBKDF2 with SHA-512 and a newly generated 16-byte random salt.
 * 
 * @param unhashedPassword - Plaintext password string provided by the user.
 * @returns A promise resolving to a {@link PasswordResponse} containing the hex-encoded hash and salt.
 */
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
        logger.error('BACKEND/SERVICE', 'Error Hashing Password', error);
        return {
            success: false,
            error: "Error generating password hash"
        }
    }

}

/**
 * Encrypts plaintext data using AES-256-GCM with a derived secret key and a random 12-byte IV.
 * Generates an authentication tag and formats output as `iv:authTag:encryptedContent`.
 * 
 * @param data - Plaintext string to encrypt.
 * @param secretKeyBuffer - 32-byte derived secret key buffer.
 * @returns An {@link EncryptionResponse} object containing the formatted encrypted payload string.
 */
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
        logger.error('BACKEND/SERVICE', 'Error Encrypting Data', error);
        return {
            success: false,
            error: "Data Encryption failed"
        }
    }
}

/**
 * Decrypts a formatted `iv:authTag:encryptedContent` payload using AES-256-GCM and verifies data integrity.
 * 
 * @param encryptedData - Delimited string containing IV, Auth Tag, and Ciphertext in hex format.
 * @param secretKeyBuffer - 32-byte derived secret key buffer.
 * @returns A {@link DecryptionResponse} object containing the original plaintext string.
 */
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
        logger.error('BACKEND/SERVICE', 'Error Decrypting Data', error);
        return {
            success: false,
            error: "Error decrypting the content, password invalid or corrupted data"
        }
    }

    

}

/**
 * Derives a 32-byte secret key for AES-256 encryption/decryption from a password and salt using PBKDF2.
 * Appends `-encryption` to the salt string to ensure key separation from authentication hashes.
 * 
 * @param unhashedPassword - Plaintext password.
 * @param salt - Hex-encoded salt string.
 * @returns A promise resolving to a 32-byte Buffer containing the secret key.
 */
export const extractSecreKey = async (unhashedPassword: string, salt: string) => {
    const newSalt = salt + "-encryption";

    return await pbkdf2Async(
        unhashedPassword, newSalt,
        310000, 32, 'sha512'
    )
}

/**
 * Computes a hash of the input password using the stored salt and compares it against the stored hash.
 * 
 * @param hashedPassword - Hex-encoded expected hash string from the database.
 * @param unhashedPassword - Plaintext password provided during verification.
 * @param salt - Hex-encoded salt string.
 * @returns A promise resolving to `true` if credentials match, `false` otherwise.
 */
export const checkPassword = async (hashedPassword: string, unhashedPassword: string, salt: string) => {
    const checkPassword = await pbkdf2Async(unhashedPassword, Buffer.from(salt, 'hex'), 310000, 64, 'sha512');
    return checkPassword.toString('hex') === hashedPassword;
}