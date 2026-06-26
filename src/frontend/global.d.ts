export {};

declare global {
  interface Window {
    tableAPI: {
      createTable: (name: string, password: string) => Promise<{ success: boolean; error?: string }>;
      countTables: () => Promise<{success: boolean, value?: number, error?: string}>;
    };
  }
}