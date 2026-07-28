import { TableData } from "@backend/interfaces/tableTypes";
import { contextBridge, ipcRenderer } from "electron";

// TableAPI
contextBridge.exposeInMainWorld('tableAPI', {
    createTable: (name: string, password: string) => ipcRenderer.invoke('table:create-table', name, password),
    getTableNames: () => ipcRenderer.invoke('table:get-all-tables'),
    deleteTable: (id: number, password: string) => ipcRenderer.invoke('table:delete-table', id, password),
    getSelectedTable: (id: number, password: string) => ipcRenderer.invoke('table:access-table', id, password),
    updateTableContent: (id: number, tableName: string, password: string, content: TableData) => ipcRenderer.invoke('table:update-table', id, tableName, password, content),
    exportTable: (csvContent: string, jsonContent: string, defaultFileName: string) => ipcRenderer.invoke('table:export-table', csvContent, jsonContent, defaultFileName),
    changeTablePassword: (id: number, tableName: string, oldPassword: string, newPassword: string, content: TableData) => 
    ipcRenderer.invoke('table:change-password', id, tableName, oldPassword, newPassword, content)

});

contextBridge.exposeInMainWorld('logAPI', {
    sendLog: (level: 'info' | 'warn' | 'error', context: string, message: string, data?: unknown) => {
        ipcRenderer.send('log-message', level, context, message, data);
    }
});
