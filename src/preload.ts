/**
 * Electron Preload Script.
 * Securely exposes IPC bridge APIs to the Renderer Process via `contextBridge`.
 * 
 * @module PreloadScript
 */

import { TableData } from "@backend/interfaces/tableTypes";
import { contextBridge, ipcRenderer } from "electron";

/**
 * Exposes table management APIs to the global `window.tableAPI` object in the renderer context.
 */
contextBridge.exposeInMainWorld('tableAPI', {
    /**
     * Sends an IPC invocation to create a new encrypted table.
     * 
     * @param name - Display name for the table.
     * @param password - Unhashed password for credential creation and encryption key derivation.
     * @returns A promise resolving to a `ServerResponse` with the created table ID.
     */
    createTable: (name: string, password: string) => ipcRenderer.invoke('table:create-table', name, password),
    
    /**
     * Sends an IPC invocation to retrieve basic metadata for all existing tables.
     * 
     * @returns A promise resolving to a `ServerResponse` containing an array of `TableDTO` items.
     */
    getTableNames: () => ipcRenderer.invoke('table:get-all-tables'),
    
    /**
     * Sends an IPC invocation to delete a table after verifying password credentials.
     * 
     * @param id - Database ID of the target table.
     * @param password - Password required for authorization.
     * @returns A promise resolving to a `ServerResponse` indicating deletion success.
     */
    deleteTable: (id: number, password: string) => ipcRenderer.invoke('table:delete-table', id, password),
    
    /**
     * Sends an IPC invocation to authenticate and retrieve decrypted table contents.
     * 
     * @param id - Database ID of the target table.
     * @param password - Password required for key derivation and decryption.
     * @returns A promise resolving to a `ServerResponse` containing `DecryptedTableDTO`.
     */
    getSelectedTable: (id: number, password: string) => ipcRenderer.invoke('table:access-table', id, password),
    
    /**
     * Sends an IPC invocation to encrypt and update an existing table's contents.
     * 
     * @param id - Database ID of the target table.
     * @param tableName - Display name of the table.
     * @param password - Password used to derive the encryption key.
     * @param content - Plaintext {@link TableData} payload to encrypt and store.
     * @returns A promise resolving to a `ServerResponse` indicating update success.
     */
    updateTableContent: (id: number, tableName: string, password: string, content: TableData) => ipcRenderer.invoke('table:update-table', id, tableName, password, content),
    
    /**
     * Sends an IPC invocation to trigger a native save dialog and write CSV or JSON content to disk.
     * 
     * @param csvContent - Formatted CSV data string.
     * @param jsonContent - Formatted JSON data string.
     * @param defaultFileName - Default filename proposed in the native save dialog.
     * @returns A promise resolving to a `ServerResponse` indicating export status.
     */
    exportTable: (csvContent: string, jsonContent: string, defaultFileName: string) => ipcRenderer.invoke('table:export-table', csvContent, jsonContent, defaultFileName),
    
    /**
     * Sends an IPC invocation to re-key and re-encrypt a table under a new password.
     * 
     * @param id - Database ID of the target table.
     * @param tableName - Display name of the table.
     * @param oldPassword - Current password to authorize the change.
     * @param newPassword - New password to apply for future key derivation.
     * @param content - Plaintext {@link TableData} payload to re-encrypt.
     * @returns A promise resolving to a `ServerResponse` indicating operation status.
     */
    changeTablePassword: (id: number, tableName: string, oldPassword: string, newPassword: string, content: TableData) => 
    ipcRenderer.invoke('table:change-password', id, tableName, oldPassword, newPassword, content)

});

/**
 * Exposes logging utility APIs to the global `window.logAPI` object in the renderer context.
 */
contextBridge.exposeInMainWorld('logAPI', {
    
    /**
     * Dispatches a log event from the renderer process to the main process logger via IPC.
     * 
     * @param level - Log severity level (`'info'`, `'warn'`, or `'error'`).
     * @param context - Logical subsystem name originating the log event.
     * @param message - Summary log message.
     * @param data - Optional dynamic payload or metadata attached to the log event.
     */
    sendLog: (level: 'info' | 'warn' | 'error', context: string, message: string, data?: unknown) => {
        ipcRenderer.send('log-message', level, context, message, data);
    }
});
