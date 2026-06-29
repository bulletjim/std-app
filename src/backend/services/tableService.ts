import { CreateTableRequest } from "../interfaces/tableTypes"
import * as tableRepository from "../db/tableRepository"
import { ServiceResponse } from "../interfaces/serviceTypes";
import { checkPassword, encryptData, extractSecreKey, hashPassword } from "./securityService";

export const saveTable = async (tableName: string, unhashedPassword: string) : Promise<ServiceResponse<number>> => {
    const hashResult = await hashPassword(unhashedPassword);
    if(!hashResult.success || !hashResult.hashedPassword || !hashResult.salt){
        return {success: false, error: "Table not created"}
    }
    
    const secretKey = await extractSecreKey(unhashedPassword, hashResult.salt);

    const initTableValues = JSON.stringify({rows: [], columns: []})

    const encryptedDataResult = encryptData(initTableValues, secretKey);

    if(!encryptedDataResult.success || !encryptedDataResult.encryptedContent){
        return {success: false, error: "Table not created"}
    }

    const newTable: CreateTableRequest = {
        tableName: tableName,
        passwordHash: hashResult.hashedPassword,
        passwordSalt: hashResult.salt,
        encryptedContent: encryptedDataResult.encryptedContent
    }

    const insertedRowId = tableRepository.createTable(newTable);
    if(insertedRowId == null){
        return {
            success: false,
            error: "Table not created"
        }
    } else {
        return {
            success: true,
            value: insertedRowId as number
        }
    }

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

export const checkDeleteTable = async (id: number, unhashedPassword: string) : Promise<ServiceResponse<number>> => {

    const table = tableRepository.getTableById(id);
    if(table) {
        const checkedPassword = await checkPassword(table.passwordHash, unhashedPassword, table.passwordSalt);
        if(checkedPassword) {
            const deletedRow = tableRepository.deleteTable(id);
            if(deletedRow === 0){
                return {
                    success: false,
                    error: "Table not deleted"
                }
            }
            return {
                success: true,
                value: deletedRow
            }
        } else {
            return {
                success:false,
                error: "Invalid password"
            }
        }
        
    } else {
        return {
            success: false,
            error: "Table Not Found"
        }
    } 
    
}