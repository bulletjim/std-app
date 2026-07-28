import { DecryptedTableDTO, TableData, TableDTO } from "@backend/interfaces/tableTypes";
import { logger } from "./util/logger";

export const createTable = async (tableName: string, password: string) : Promise<boolean> => {

    try{
        const response = await window.tableAPI.createTable(tableName, password);
        if(!response.success) {
            logger.warn('API', 'API call failed', response.error);
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
        logger.warn('API', 'API call failed', response.error);
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
        logger.warn('API', 'API call failed', response.error);
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
        logger.warn('API', 'API call failed', response.error);
        return null;
    } catch(error){
        logger.error('API', 'API call error', error);
        return null;
    }
}

export const saveTableContent = async (id: number, tableName: string, password: string, content: TableData) : Promise<boolean> => {
    try {
        const response = await window.tableAPI.updateTableContent(id, tableName, password, content);
        if(response.success){
            logger.info('API', 'API call succesful');
            return true;
        }
        logger.warn('API', 'API call failed', response.error);
        return false;
    } catch(error){
        logger.error('API', 'API call error', error);
        return false;
    }
}

export const exportTable = async (csvContent: string, jsonContent: string, defaultFileName: string) : Promise<boolean> => {
    try{
        const response = await window.tableAPI.exportTable(csvContent, jsonContent, defaultFileName);
        if(response.success){
            logger.info('API', 'API call successful');
            return true;
        }
        logger.warn('API', 'API call failed', response.error);
        return false;
    } catch(error){
        logger.error('API', 'API call error', error);
        return false;
    }
}

export const changeTablePassword = async (id: number, tableName: string, oldPassword: string, newPassword: string, content: TableData) : Promise<boolean> => {
    try{
        const response = await window.tableAPI.changeTablePassword(id, tableName, oldPassword, newPassword, content);
        if(response.success){
            logger.info('API', 'API call successful');
            return true;
        }
        logger.warn('API', 'API call failed', response.error);
        return false;
    } catch(error){
        logger.error('API', 'API call error', error);
        return false;
    }
}
