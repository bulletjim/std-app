import { DecryptedTableDTO, TableData, TableDTO } from "@backend/interfaces/tableTypes";
import { logger } from "./util/logger";

export const createTable = async (tableName: string, password: string) : Promise<boolean> => {

    try{
        const response = await window.tableAPI.createTable(tableName, password);
        if(!response.success) {
            logger.warn('API', 'API call failed');
            return false;
        }

        logger.info('API', 'API call successful');
        return true;
    } catch (error) {
        logger.error('API', 'API call error', error);
        return false;
    }
}

export const fetchTableNames = async () : Promise<TableDTO[] | null> => {
    
    try{
        const response = await window.tableAPI.getTableNames();
        if(response.success){
            logger.info('API', 'API call successful');
            return response.value as TableDTO[];
        }
        logger.warn('API', 'API call failed');
        return null;
    } catch (error) {
        logger.error('API', 'API call error', error);
        return null;
    }
}

export const deleteSelectedTable = async (id: number, password: string) : Promise<boolean> => {
    try{
        const response = await window.tableAPI.deleteTable(id, password);
        if(response.success) {
            logger.info('API', 'API call successful');
            return true;
        }
        logger.warn('API', 'API call failed');
        return false; 
    } catch(error) {
        logger.error('API', 'API call error', error);
        return false;
    }
}

export const accessTable = async (id: number, password: string) : Promise<DecryptedTableDTO | null> => {
    try{
        const response = await window.tableAPI.getSelectedTable(id, password);
        if(response.success && response.value) {
            logger.info('API', 'API call successful');
            return response.value;
        }
        logger.warn('API', 'API call failed');
        return null;
    } catch(error){
        logger.error('API', 'API call error', error);
        return null;
    }
}

export const saveTableContent = async (id: number, password: string, content: TableData) : Promise<boolean> => {
    try {
        const response = await window.tableAPI.updateTableContent(id, password, content);
        if(response.success){
            logger.info('API', 'API call succesful');
            return true;
        }
        logger.warn('API', 'API call failed');
        return false;
    } catch(error){
        logger.error('API', 'API call error', error);
        return false;
    }
}
