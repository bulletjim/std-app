/**
 * Frontend API client module serving as an abstraction layer between UI components
 * and Electron IPC main process channels (`window.tableAPI`).
 * Handles result validation, error catching, and renderer logging.
 * 
 * @module FrontendAPI
 */

import { DecryptedTableDTO, TableData, TableDTO } from "@backend/interfaces/tableTypes";
import { logger } from "./util/logger";

/**
 * Invokes the IPC bridge to create a new encrypted table record.
 * 
 * @param tableName - Display name for the table to create.
 * @param password - Unhashed password for key derivation and credential creation.
 * @returns A promise resolving to `true` if creation succeeded, or `false` otherwise.
 */
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

/**
 * Fetches basic metadata for all existing tables in the database.
 * 
 * @returns A promise resolving to an array of {@link TableDTO} objects, or `null` if no tables are found or an error occurs.
 */
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

/**
 * Deletes a specified table record after verifying user password credentials.
 * 
 * @param id - Unique database ID of the target table.
 * @param password - Authorization password.
 * @returns A promise resolving to `true` if deleted successfully, or `false` otherwise.
 */
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

/**
 * Authenticates user credentials and retrieves decrypted table payload for display.
 * 
 * @param id - Unique database ID of the target table.
 * @param password - Password required for decryption key derivation.
 * @returns A promise resolving to {@link DecryptedTableDTO} if successfully authenticated, or `null` on failure.
 */
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

/**
 * Re-encrypts and persists updated table contents to storage.
 * 
 * @param id - Unique database ID of the target table.
 * @param tableName - Display name of the table.
 * @param password - Password used to derive the encryption key.
 * @param content - Plaintext {@link TableData} payload to encrypt and store.
 * @returns A promise resolving to `true` on success, or `false` on failure.
 */
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

/**
 * Triggers native OS file dialog to export table content in CSV or JSON format.
 * 
 * @param csvContent - Formatted CSV data payload.
 * @param jsonContent - Formatted JSON data payload.
 * @param defaultFileName - Default suggested filename in the save dialog.
 * @returns A promise resolving to `true` if exported, or `false` if cancelled or failed.
 */
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

/**
 * Re-keys and re-encrypts table contents under a new password.
 * 
 * @param id - Unique database ID of the target table.
 * @param tableName - Display name of the table.
 * @param oldPassword - Current password required for verification.
 * @param newPassword - Replacement password for future key derivation.
 * @param content - Plaintext {@link TableData} payload to re-encrypt.
 * @returns A promise resolving to `true` if password change succeeded, or `false` otherwise.
 */
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
