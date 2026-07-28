/**
 * Controller mapping Electron IPC main channel invocations (`ipcMain.handle`)
 * to table business services and native dialog interactions.
 * 
 * @module TableController
 */

import { dialog, ipcMain, IpcMainInvokeEvent } from "electron"
import fs from 'fs';
import * as tableService from "../services/tableService"
import { ServerResponse } from "@backend/interfaces/index";
import { DecryptedTableDTO, TableData, TableDTO } from "@backend/interfaces/tableTypes";
import { logger } from "../util/logger";

/**
 * Registers all table-related IPC message handlers in the Electron main process.
 * Should be called once during application startup in `main.ts`.
 */
export const setupTableHandlers = () => {
    
    /**
     * Handles table creation requests.
     */
    ipcMain.handle('table:create-table', async (event: IpcMainInvokeEvent, tableName: string, password: string) : Promise<ServerResponse<number>> => {
        try{
            return await tableService.saveTable(tableName, password) as ServerResponse<number>;
        } catch(error){
            logger.error('BACKEND-CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error"};
        }
    });

    /**
     * Retrieves basic info for all existing user tables.
     */
    ipcMain.handle('table:get-all-tables', async () : Promise<ServerResponse<TableDTO[] | null>> => {
        try{
            const response = await tableService.verifyTableNames();
            if(response){
                return {
                    success: true,
                    value: response,
                }
            } 
            return {
                success: false,
                value: null,
                error: "Tables not found"
                    
            }
            
        } catch(error){
            logger.error('BACKEND-CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error"};
        }
    });
    
    /**
     * Deletes a table after verifying password credentials.
     */
    ipcMain.handle('table:delete-table', async (event: IpcMainInvokeEvent, id: number, password: string) : Promise<ServerResponse<number>> => {
        try {
            return await tableService.checkDeleteTable(id, password);
        } catch(error){
            logger.error('BACKEND-CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error"};
        }
    });

    /**
     * Authenticates and decrypts table contents.
     */
    ipcMain.handle('table:access-table', async (event: IpcMainInvokeEvent, id: number, password: string) : Promise<ServerResponse<DecryptedTableDTO>> => {
        try{
            return await tableService.checkSelectedTable(id, password);
        } catch(error){
            logger.error('BACKEND-CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error"};
        }
    });

    /**
     * Encrypts and updates existing table content.
     */
    ipcMain.handle('table:update-table', async (event: IpcMainInvokeEvent, id: number, tableName: string , password: string, content: TableData) : Promise<ServerResponse<number>> => {
        try{
            return await tableService.saveTableContent(id, tableName, password, content);
        } catch(error) {
            logger.error('BACKEND-CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error"};
        }
    });

    /**
     * Opens a native OS file save dialog to export table content as CSV or JSON.
     */
    ipcMain.handle('table:export-table', async (event: IpcMainInvokeEvent, csvContent: string, jsonContent: string, defaultFileName: string) : Promise<ServerResponse<boolean>> => {
        const {filePath} = await dialog.showSaveDialog({
            defaultPath: defaultFileName,
            title: 'Export Table Data',
            filters: [
                {name: 'CSV File', extensions: ['csv']},
                {name: 'JSON File', extensions: ['json']}
            ]
        });

        if(filePath){
            const contentToWrite = filePath.endsWith('.json') ? jsonContent : csvContent;
            fs.writeFileSync(filePath, contentToWrite, 'utf-8');
            return {success: true };
        }
        return {success: false, error: 'Operation Cancelled'};
    });

    /**
     * Re-key/re-encrypt table payload under a new password.
     */
    ipcMain.handle('table:change-password', async (event: IpcMainInvokeEvent, id: number, tableName: string, oldPassword: string, newPassword: string, content: TableData) : Promise<ServerResponse<number>> => {

        try{
            return await tableService.changeTablePassword(id, tableName, oldPassword, newPassword, content);
        } catch(error) {
            logger.error('BACKEND-CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error"};
        }
    });
}
