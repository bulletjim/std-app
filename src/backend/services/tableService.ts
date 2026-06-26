import { CreateTableRequest } from "../interfaces/tableTypes"
import * as tableRepository from "../db/tableRepository"
import { ServiceResponse } from "../interfaces/serviceTypes";

export const createTable = async (tableName: string, unhashedPassword: string) : Promise<ServiceResponse<void>> => {
    
    // MOCK table
    const newTable: CreateTableRequest = {
        tableName: tableName,

        passwordHash: unhashedPassword,
        passwordSalt: "mock-salt",
        encryptedContent: JSON.stringify({rows: [], columns: [] })
    };

    const newId = tableRepository.createTable(newTable);
    if(newId == 0){
        return {
            success: false,
            error: "Table not created"
        }
    }
    return {success: true}
}

export const checkCountTables = async () : Promise<ServiceResponse<number>> => {
    const rows = tableRepository.countTotalTables();

    if(rows == 0){
        return {
            success:false,
            value: rows,
            error: "No tables found"
        }
    }

    return {
        success:true,
        value:rows
    }
}