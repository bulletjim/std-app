import { ServerResponse } from "@backend/interfaces/controllerTypes";
import { TableDTO } from "@backend/interfaces/tableTypes";

export {};

declare global {
  interface Window {
    tableAPI: {
      createTable: (name: string, password: string) => Promise<ServerResponse<number>>;
      getTableNames: () => Promise<ServerResponse<TableDTO[] | null>>;
    };
    logAPI: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendLog: (level: 'info' | 'warn' | 'error', context: string, message: string, data?: any) => void;
    }
  }
}