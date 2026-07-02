import { ipcMain, IpcMainInvokeEvent } from "electron"
import * as tableService from "../services/tableService"

export const setupTableHandlers = () => {
    ipcMain.handle('table:create-table', async (event: IpcMainInvokeEvent, tableName: string, password: string) => {
        try{
            return await tableService.saveTable(tableName, password);
        } catch(error){
            console.log("[ERROR] ", error);
            return {success: false, error: "Internal Server Error: Unable to create the table"};
        }
    })

    ipcMain.handle('table:count-tables', async () => {
        try{
            return await tableService.checkCountTables();
        } catch(error){
            console.log("[ERROR] ", error);
            return {success: false, error: "Internal Server Error"};
        }
    })

    ipcMain.handle('table:delete-table', async (event: IpcMainInvokeEvent, id: number, password: string) => {
        try {
            return await tableService.checkDeleteTable(id, password);
        } catch(error){
            console.log("[ERROR] ", error);
            return {success: false, error: "Internal Server Error"};
        }
    })
}