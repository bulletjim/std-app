/**
 * Interfaces defining response structures for cryptographic operations 
 * such as encryption, decryption, and password hashing.
 * 
 * @module SecurityTypes
 */

/**
 * Outcome payload returned by encryption procedures.
 */
export interface EncryptionResponse{
    /** Indicates whether encryption succeeded */
    success: boolean,
    /** Formatted ciphertext payload (`iv:authTag:encryptedContent`) if successful */
    encryptedContent?: string,
    /** Error message if encryption failed */
    error?: string
}

/**
 * Outcome payload returned by decryption procedures.
 */
export interface DecryptionResponse{
    /** Indicates whether decryption succeeded and authentication tag verified */
    success: boolean,
    /** Original plaintext content string if successful */
    decryptedContent?: string,
    /** Error message if decryption or authentication tag verification failed */
    error?: string
}

/**
 * Outcome payload returned by password hashing procedures.
 */
export interface PasswordResponse{
    /** Indicates whether password hashing succeeded */
    success: boolean,
    /** Derived hex-encoded password hash */
    hashedPassword?: string,
    /** Hex-encoded random salt generated during hashing */
    salt?: string,
    /** Error message if hash derivation failed */
    error?: string
}