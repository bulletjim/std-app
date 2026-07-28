/**
 * Global type declaration augmentation extending the browser `Window` interface
 * with Electron contextBridge IPC interfaces.
 * 
 * @module GlobalDeclarations
 */

import { ServerResponse } from "@backend/interfaces";
import { DecryptedTableDTO, TableData, TableDTO } from "@backend/interfaces/tableTypes";

export {};

declare global {
  interface Window {

    /**
     * Exposed table management IPC methods accessible in the renderer context via `contextBridge`.
     */
    tableAPI: {
      /** Creates a new encrypted table record */
      createTable: (name: string, password: string) => Promise<ServerResponse<number>>;     
      /** Retrieves basic metadata for all existing tables */
      getTableNames: () => Promise<ServerResponse<TableDTO[] | null>>;   
      /** Deletes a table record after credential validation */
      deleteTable: (id: number, password: string) => Promise<ServerResponse<number>>;    
      /** Validates credentials and returns decrypted table contents */
      getSelectedTable: (id: number, password: string) => Promise<ServerResponse<DecryptedTableDTO>>;    
      /** Re-encrypts and updates stored table data payload */
      updateTableContent: (id: number, tableName: string, password: string, content: TableData) => Promise<ServerResponse<number>>;     
      /** Opens native save dialog to export CSV or JSON payloads */
      exportTable: (csvContent: string, jsonContent: string, defaultFileName: string) => Promise<ServerResponse<boolean>>;
      /** Updates table password and re-encrypts payload under new secret key */
      changeTablePassword: (id: number, tableName: string, oldPassword: string, newPassword: string, content: TableData) => Promise<ServerResponse<boolean>>;
    };

    /**
     * Exposed logging utility methods for forwarding renderer events to `electron-log`.
     */
    logAPI: {
      /** Dispatches formatted log events from renderer to main process */
      sendLog: (level: 'info' | 'warn' | 'error', context: string, message: string, data?: unknown) => void;
    }
  }
}