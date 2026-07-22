export interface CreateTableRequest {
    tableName: string,
    passwordHash: string,
    passwordSalt: string,
    encryptedContent: string
}

export interface TableDTO {
    id: number,
    tableName: string,
    passwordHash: string,
    passwordSalt: string,
    encryptedContent?: string
}

export interface DecryptedTableDTO {
    id: number,
    tableName: string,
    decryptedContent: TableData
}

export interface TableData{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: Record<string, any>[],
    columns: string[]
}