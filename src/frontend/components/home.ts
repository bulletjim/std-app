import { createTable } from "@frontend/api";
import { navigateTo } from "@frontend/router";

export const initHome = () : void => {

    const form = document.getElementById('form-access-table') as HTMLFormElement;

    if(!form) {
        console.error('[HOME/ERROR]: Form element not found');
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
                console.log('Access Granted');
                form.reset();

                navigateTo('view-dashboard');

            } else {
                alert('Wrong Passoword');
            }

        } catch (error) {
            console.error('[HOME/ERROR]: ', error);
        }

    })
}