import { createTable } from "../api";
import { navigateTo } from "../router";
import { loadDashboard } from "./dashboard";

export const changeToCreateTable = () : void => {

    const form = document.getElementById('form-create-table') as HTMLFormElement;

    if(!form) {
        console.error('[CREATE-TABLE/ERROR]: Form element not found');
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
                console.log('[CREATE-TABLE/LOG] Table Created');
                form.reset();
                navigateTo('view-dashboard');
                loadDashboard();

            } else {
                alert('Wrong Passoword');
            }

        } catch (error) {
            console.error('[CRETATE-TABLE/ERROR]: ', error);
        }

    })
}