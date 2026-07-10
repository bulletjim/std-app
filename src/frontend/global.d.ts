import { ServerResponse } from "@backend/interfaces/controllerTypes";
import { DecryptedTableDTO, TableDTO } from "@backend/interfaces/tableTypes";

export {};

declare global {
  interface Window {
    tableAPI: {
      createTable: (name: string, password: string) => Promise<ServerResponse<number>>;
      getTableNames: () => Promise<ServerResponse<TableDTO[] | null>>;
      deleteTable: (id: number, password: string) => Promise<ServerResponse<number>>;
      getSelectedTable: (id: number, password: string) => Promise<ServerResponse<DecryptedTableDTO>>;
    };
    logAPI: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendLog: (level: 'info' | 'warn' | 'error', context: string, message: string, data?: any) => void;
    }
  }
}