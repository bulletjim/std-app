import { TableDTO } from "@backend/interfaces/tableTypes";

export const createTable = async (tableName: string, password: string) : Promise<boolean> => {

    try{
        const response = await window.tableAPI.createTable(tableName, password);
        if(!response.success) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('[API/ERROR]: ', error);
        return false;
    }
}

export const fetchTableNames = async () : Promise<TableDTO[] | null> => {
    
    try{
        const response = await window.tableAPI.getTableNames();
        if(response.success){
            return response.value as TableDTO[];
        }
        return null;
    } catch (error) {
        console.error('[API/ERROR]:', error);
        return null;
    }
}
