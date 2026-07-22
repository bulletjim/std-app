import { CreateTableRequest, DecryptedTableDTO, TableData, TableDTO } from "@backend/interfaces/tableTypes"
import * as tableRepository from "../db/tableRepository"
import { ServiceResponse } from "@backend/interfaces/serviceTypes";
import { checkPassword, decryptData, encryptData, extractSecreKey, hashPassword } from "../services/securityService";

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


export const verifyTableNames = async () : Promise<TableDTO[] | null> => {
    const tableNames = tableRepository.getAllTableInfos();
    if(tableNames.length !== 0){
        return tableNames;
    }

    return null;
    
}


export const checkDeleteTable = async (id: number, unhashedPassword: string) : Promise<ServiceResponse<number>> => {

    const table = tableRepository.getTableById(id);
    if(table) {
        const checkedPassword = await checkPassword(table.passwordHash as string, unhashedPassword, table.passwordSalt as string);
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

export const checkSelectedTable = async (id: number, password: string) : Promise<ServiceResponse<DecryptedTableDTO>> => {
    const table = tableRepository.getTableById(id);
    if(table){
        const checkedPassword = await checkPassword(table.passwordHash, password, table.passwordSalt);
        if(checkedPassword){
            const secretKey = await extractSecreKey(password, table.passwordSalt);
            const decryptedData = decryptData(table.encryptedContent as string, secretKey);
            if(decryptedData.success){
                const decryptedTable : DecryptedTableDTO= {
                    id: table.id,
                    tableName: table.tableName,
                    decryptedContent: JSON.parse(decryptedData.decryptedContent as string) as TableData

                }
                
                return {
                    success: true,
                    value: decryptedTable
                }
            }
        } else {
            return {
                success: false,
                error: "Password is invalid"
            }
        }
    }
    return {
        success: false,
        error: "Table not found"
    }
    
}

export const saveTableContent = async (id: number, password: string, content: TableData) : Promise<ServiceResponse<number>> => {
    const table = tableRepository.getTableById(id);
    if(table) {
        const checkedPassword = await checkPassword(table.passwordHash, password, table.passwordSalt);
        if(checkedPassword) {
            const extractedSecretKey = await extractSecreKey(password, table.passwordSalt);
            const stringifiedContent = JSON.stringify(content);

            const encryptedContent = encryptData(stringifiedContent, extractedSecretKey);
            if(!encryptedContent.success || !encryptedContent.encryptedContent){
                return {success: false, error: "Table not updated"}
            }
            const updatedTable: TableDTO = {
                id: table.id,
                tableName: table.tableName,
                passwordHash: table.passwordHash,
                passwordSalt: table.passwordSalt,
                encryptedContent: encryptedContent.encryptedContent
            } 

            const result = tableRepository.updateTable(updatedTable);
            if(result === 0){
                return {
                    success: false,
                    error: "Table not Updated"
                }
            } else {
                return {
                    success: true,
                    value: result
                }
            }
        }
    } 
    return {
        success: false,
        error: "Table not found"
    }
}