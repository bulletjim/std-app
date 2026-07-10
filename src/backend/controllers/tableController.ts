import { ipcMain, IpcMainInvokeEvent } from "electron"
import * as tableService from "../services/tableService"
import { ServerResponse } from "@backend/interfaces/controllerTypes";
import { DecryptedTableDTO, TableDTO } from "@backend/interfaces/tableTypes";
import { logger } from "../util/logger";

export const setupTableHandlers = () => {
    ipcMain.handle('table:create-table', async (event: IpcMainInvokeEvent, tableName: string, password: string) : Promise<ServerResponse<number>> => {
        try{
            return await tableService.saveTable(tableName, password) as ServerResponse<number>;
        } catch(error){
            logger.error('BACKEND/CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error: Unable to create the table"};
        }
    })

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
            logger.error('BACKEND/CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error"};
        }
    })
    
    ipcMain.handle('table:delete-table', async (event: IpcMainInvokeEvent, id: number, password: string) : Promise<ServerResponse<number>> => {
        try {
            return await tableService.checkDeleteTable(id, password);
        } catch(error){
            logger.error('BACKEND/CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Server Error"};
        }
    })

    ipcMain.handle('table:access-table', async (event: IpcMainInvokeEvent, id: number, password: string) : Promise<ServerResponse<DecryptedTableDTO>> => {
        try{
            return await tableService.checkSelectedTable(id, password);
        } catch(error){
            logger.error('BACKEND/CONTROLLER', 'Internal Server Error', error);
            return {success: false, error: "Internal Servver Error"};
        }
    })
}