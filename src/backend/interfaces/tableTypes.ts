export interface CreateTableRequest {
    tableName: string,
    passwordHash: string,
    passwordSalt: string,
    encryptedContent: string
}

export interface TableDTO {
    tableName: string,
    passwordHash: string,
    passwordSalt: string
}