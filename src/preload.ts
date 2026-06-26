import { contextBridge, ipcRenderer } from "electron";

// TableAPI
contextBridge.exposeInMainWorld('tableAPI', {
    createTable: (name: string, password: string) => ipcRenderer.invoke('table:create-table', name, password),
    countTables: () => ipcRenderer.invoke('table:count-tables')

})
