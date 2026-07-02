
export const createTable = async (tableName: string, password: string) : Promise<boolean> => {

    try{
        const response = await window.tableAPI.createTable(tableName, password);
        if(!response.success) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('[API/ERROR]: ', error);
        return false;
    }
}

/* This function is declared rn; it should be refactored
    this function should return as a promise: 
    an array or a list of tables or a custom interface
export const getTablesList = async () : Promise<number> => {
    
    try{
        const response = await window.tableAPI.countTables();
        if(!response.success){
            return 0;
        }

        return response.value as number;
    } catch (error) {
        console.error('[API/ERROR]:', error);
        return 0;
    }
}
*/