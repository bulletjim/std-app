import { ServerResponse } from "@backend/interfaces";
import { DecryptedTableDTO, TableData, TableDTO } from "@backend/interfaces/tableTypes";

export {};

declare global {
  interface Window {
    tableAPI: {
      createTable: (name: string, password: string) => Promise<ServerResponse<number>>;
      getTableNames: () => Promise<ServerResponse<TableDTO[] | null>>;
      deleteTable: (id: number, password: string) => Promise<ServerResponse<number>>;
      getSelectedTable: (id: number, password: string) => Promise<ServerResponse<DecryptedTableDTO>>;
      updateTableContent: (id: number, tableName: string, password: string, content: TableData) => Promise<ServerResponse<number>>;
      exportTable: (csvContent: string, jsonContent: string, defaultFileName: string) => Promise<ServerResponse<boolean>>;
      changeTablePassword: (id: number, tableName: string, oldPassword: string, newPassword: string, content: TableData) => Promise<ServerResponse<boolean>>;
    };
    logAPI: {
      sendLog: (level: 'info' | 'warn' | 'error', context: string, message: string, data?: unknown) => void;
    }
  }
}