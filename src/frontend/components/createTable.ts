import { logger } from "../util/logger";
import { createTable } from "../api";
import { navigateTo } from "../router";
import { loadDashboard } from "./dashboard";

export const changeToCreateTable = () : void => {

    const form = document.getElementById('form-create-table') as HTMLFormElement;

    if(!form) {
        logger.error('CREATE-TABLE', 'Form element not found');
        return;
    }

    form.addEventListener('submit', async (event:SubmitEvent) => {
        event.preventDefault();
        
        const tableNameInput = document.getElementById('table-name') as HTMLInputElement;
        const tablePasswordInput = document.getElementById('table-password') as HTMLInputElement;

        const tableName = tableNameInput.value.trim();
        const password = tablePasswordInput.value;
        if(!tableName || !password){
            alert("Please Insert both table name and password");
            return;
        }

        try{

            const success = await createTable(tableName, password);
            if(success) {
                logger.info('CREATE-TABLE', `Table: ${tableName} created`);
                form.reset();
                navigateTo('view-dashboard');
                loadDashboard();

            } else {
                alert('Wrong Passoword');
                logger.warn('CREATE-TABLE', 'The password is invalid');
            }

        } catch (error) {
            logger.error('CREATE-TABLE', "Context Change Failed", error);
        }

    })
}