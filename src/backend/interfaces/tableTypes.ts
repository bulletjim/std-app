export interface CreateTableRequest {
    tableName: string,
    passwordHash: string,
    passwordSalt: string,
    encryptedContent: string
}