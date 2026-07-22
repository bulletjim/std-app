/* eslint-disable @typescript-eslint/no-explicit-any */
import { DecryptedTableDTO } from "@backend/interfaces/tableTypes";
import { logger } from "../util/logger";
import { saveTableContent } from "../api";

let currentTableData: DecryptedTableDTO | null = null;
let currentTablePassword: string | null = null;
let isDetailInitialized = false;

export const loadTableDetail = (tableData: DecryptedTableDTO, password: string) => {
    currentTableData = tableData;
    currentTablePassword = password; 
    
    setupDetailEvents(); 
    renderTable();
};

const renderTable = () => {
    if (!currentTableData) return;

    const theadRow = document.getElementById('table-head-row');
    const tbody = document.getElementById('table-body-container');
    if (!theadRow || !tbody) return;

    theadRow.innerHTML = '';
    currentTableData.decryptedContent.columns.forEach((col) => {
        const th = document.createElement('th');
        th.textContent = col;
        theadRow.appendChild(th);
    });
    const thActions = document.createElement('th');
    thActions.textContent = "Actions";
    theadRow.appendChild(thActions);

    tbody.innerHTML = '';
    currentTableData.decryptedContent.rows.forEach((rowData, rowIndex) => {
        const tr = document.createElement('tr');

        currentTableData?.decryptedContent.columns.forEach((col) => {
            const td = document.createElement('td');
            td.textContent = rowData[col] !== undefined ? String(rowData[col]) : '';
            
            td.contentEditable = "true"; 
            
            td.addEventListener('blur', (e) => {
                const newValue = (e.target as HTMLElement).textContent?.trim() || '';
                if(currentTableData) currentTableData.decryptedContent.rows[rowIndex][col] = newValue;
            });

            tr.appendChild(td);
        });

        const tdActions = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'danger-text';
        deleteBtn.addEventListener('click', () => {
            currentTableData?.decryptedContent.rows.splice(rowIndex, 1);
            renderTable();
        });

        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
    });
};

const setupDetailEvents = () => {
    if (isDetailInitialized) return;

    const modal = document.getElementById('modal-row-form') as HTMLDialogElement;
    const form = document.getElementById('form-dynamic-row') as HTMLFormElement;
    const addColModal = document.getElementById('modal-add-column') as HTMLDialogElement;
    const addColForm = document.getElementById('form-add-column') as HTMLFormElement;
    const addColInput = document.getElementById('new-column-name') as HTMLInputElement;

    document.getElementById('btn-cancel-row')?.addEventListener('click', () => {
        modal.close();
        form.reset();
    });

    document.getElementById('btn-save-db')?.addEventListener('click', async () => {
        if (!currentTableData || !currentTablePassword) return;

        try {
            logger.info('TABLE-DETAIL', 'Saving into DB...');
            const response = await saveTableContent(
                currentTableData.id, 
                currentTablePassword,
                currentTableData.decryptedContent
            );

            if (response) {
                logger.info('TABLE-DETAIL', `Table: ${currentTableData.tableName} modified`);
                alert("Data saved successfuly");
            } else {
                alert("Error saving data");
                logger.warn('TABLE-DETAIL', 'The password is invalid');
            }
        } catch (error) {
            logger.error('TABLE-DETAIL', 'Saving data failed', error);
        }
    });

    

    document.getElementById('btn-add-row')?.addEventListener('click', () => {
        if (!currentTableData) return;
    
        currentTableData.decryptedContent.rows.push({});
        renderTable();
    });

    document.getElementById('btn-add-col')?.addEventListener('click', () => {
        if (!currentTableData) return;
        addColModal.showModal();
        addColInput.focus();
    });

    document.getElementById('btn-cancel-column')?.addEventListener('click', () => {
        addColModal.close();
        addColForm.reset();
    });

    addColForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentTableData) return;

        const newColName = addColInput.value.trim();
    
        if (newColName !== '') {
            if (!currentTableData.decryptedContent.columns.includes(newColName)) {
                currentTableData.decryptedContent.columns.push(newColName);
                renderTable();

                addColModal.close();
                addColForm.reset();
            } else {
                alert("This column already exists");
            }
        }
    });

    isDetailInitialized = true;
};


export const clearTableSession = () => {
    logger.info('TABLE-DETAIL', 'Session cleaning...');
    currentTableData = null;
    currentTablePassword = null; 
};