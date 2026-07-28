export type CellValue = string | number | boolean | null;

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
    rows: Record<string, CellValue>[],
    columns: string[]
}