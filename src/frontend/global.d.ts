import { ServerResponse } from "@backend/interfaces/controllerTypes";

export {};

declare global {
  interface Window {
    tableAPI: {
      createTable: (name: string, password: string) => Promise<ServerResponse<number>>;
      // TOBEREFACTORED: countTables: () => Promise<ServerResponse<number>>;
    };
  }
}