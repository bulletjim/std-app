export interface EncryptionResponse{
    success: boolean,
    encryptedContent?: string,
    error?: string
}

export interface DecryptionResponse{
    success: boolean,
    decryptedContent?: string,
    error?: string
}

export interface PasswordResponse{
    success: boolean,
    hashedPassword?: string,
    salt?: string,
    error?: string 
}