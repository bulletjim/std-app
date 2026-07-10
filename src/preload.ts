import { contextBridge, ipcRenderer } from "electron";

// TableAPI
contextBridge.exposeInMainWorld('tableAPI', {
    createTable: (name: string, password: string) => ipcRenderer.invoke('table:create-table', name, password),
    getTableNames: () => ipcRenderer.invoke('table:get-all-tables'),
    deleteTable: (id: number, password: string) => ipcRenderer.invoke('table:delete-table', id, password)

});

contextBridge.exposeInMainWorld('logAPI', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendLog: (level: 'info' | 'warn' | 'error', context: string, message: string, data?: any) => {
        ipcRenderer.send('log-message', level, context, message, data);
    }
});
