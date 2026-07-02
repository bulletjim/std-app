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