import { ipcMain, IpcMainInvokeEvent } from "electron"
import * as tableService from "../services/tableService"
import { ServerResponse } from "@backend/interfaces/controllerTypes";

export const setupTableHandlers = () => {
    ipcMain.handle('table:create-table', async (event: IpcMainInvokeEvent, tableName: string, password: string) : Promise<ServerResponse<number>> => {
        try{
            return await tableService.saveTable(tableName, password) as ServerResponse<number>;
        } catch(error){
            console.log("[ERROR] ", error);
            return {success: false, error: "Internal Server Error: Unable to create the table"};
        }
    })

    /* This function is to be refactored, must send to the client a list of current tables stored in db
    ipcMain.handle('table:count-tables', async () => {
        try{
            return await tableService.checkCountTables();
        } catch(error){
            console.log("[ERROR] ", error);
            return {success: false, error: "Internal Server Error"};
        }
    })
    */
    ipcMain.handle('table:delete-table', async (event: IpcMainInvokeEvent, id: number, password: string) => {
        try {
            return await tableService.checkDeleteTable(id, password);
        } catch(error){
            console.log("[ERROR] ", error);
            return {success: false, error: "Internal Server Error"};
        }
    })
}