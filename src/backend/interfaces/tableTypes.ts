export interface CreateTableRequest {
    tableName: string,
    passwordHash: string,
    passwordSalt: string,
    encryptedContent: string
}

export interface TableDTO {
    id: number,
    passwordHash: string,
    passwordSalt: string
}