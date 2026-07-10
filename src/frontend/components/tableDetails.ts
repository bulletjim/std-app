/* eslint-disable @typescript-eslint/no-explicit-any */
import { DecryptedTableDTO, TableData } from "@backend/interfaces/tableTypes";
import { logger } from "../util/logger";

let currentTableData: TableData | null = null;
let editingRowId: string | number | null = null;
let isDetailInitialized = false;

export const loadTableDetail = (tableData: DecryptedTableDTO) => {
    currentTableData = tableData.decryptedContent;
    setupDetailEvents();
    
    const title = document.getElementById('detail-title');
    const thead = document.querySelector('.data-table thead tr');
    const tbody = document.getElementById('table-body-container');
    const template = document.getElementById('tpl-data-row') as HTMLTemplateElement;

    if (!thead || !tbody || !template) return;

    if(title) title.textContent = tableData?.tableName as string;
    thead.innerHTML = '';

    tableData?.decryptedContent.columns.forEach((name: string) => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = name;
        thead.appendChild(th);

    })

    const thActions = document.createElement('th');
    thActions.scope = "col";
    thActions.textContent = "Actions";
    thead.appendChild(thActions);

    tbody.innerHTML = '';
    tableData.decryptedContent.rows.forEach((rowData) => {
        const tr = document.createElement('tr');

        tableData.decryptedContent.columns.forEach((name: string) => {
            const td = document.createElement('td');
            td.textContent = rowData[name] !== undefined ? String(rowData[name]) : '';
            tr.appendChild(td);
        });

        const tdActions = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.className = 'tpl-btn-edit';
        editBtn.textContent = 'Edit';
        
        editBtn.addEventListener('click', () => {
            openRowModal(rowData);
        });

        tdActions.appendChild(editBtn);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
    });
}

const setupDetailEvents = () => {
    if (isDetailInitialized) return;

    const addRowBtn = document.getElementById('btn-add-row');
    addRowBtn?.addEventListener('click', () => {
        openRowModal();
    });

    const modal = document.getElementById('modal-row-form') as HTMLDialogElement;
    const form = document.getElementById('form-dynamic-row') as HTMLFormElement;
    const cancelBtn = document.getElementById('btn-cancel-row');

    cancelBtn?.addEventListener('click', () => {
        modal.close();
        form.reset();
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentTableData) return;

        const formData = new FormData(form);
        const newRowData: Record<string, any> = {};
        
        currentTableData.columns.forEach(col => {
            newRowData[col] = formData.get(col);
        });

        try {
            if (editingRowId) {
                logger.info('TABLE-DETAIL', `Saving row in table id: ${editingRowId}`);
                // TODO: Call UPDATE row API
                // await window.tableAPI.updateRow(currentTableData.id, editingRowId, newRowData);
            } else {
                logger.info('TABLE-DETAIL', 'Inserting new row');
                // TODO: Call INSERT row Api
                // await window.tableAPI.insertRow(currentTableData.id, newRowData);
            }

            modal.close();
            form.reset();
            
            // TODO: After DB operations Reset datas and recall loadTableDetail

        } catch (error) {
            logger.error('TABLE-DETAIL', 'Error saving new row', error);
        }
    });

    isDetailInitialized = true;
};

const openRowModal = (rowData?: Record<string, any>) => {
    if (!currentTableData) return;

    const modal = document.getElementById('modal-row-form') as HTMLDialogElement;
    const container = document.getElementById('dynamic-inputs-container');
    const title = document.getElementById('modal-row-title');
    
    if(!modal || !container || !title) return;

    title.textContent = rowData ? 'Edit Row' : 'Add Row';
    
    editingRowId = rowData ? (rowData['ID'] || rowData['id'] || null) : null; 

    container.innerHTML = '';


    currentTableData.columns.forEach((column: string)  => {
        const div = document.createElement('div');
        
        const label = document.createElement('label');
        label.textContent = column;
        label.htmlFor = `input-${column}`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-${column}`;
        input.name = column;
        
        if (rowData && rowData[column] !== undefined) {
            input.value = String(rowData[column]);
        }
        
        if (rowData && column.toLowerCase() === 'id') {
            input.readOnly = true;
            input.classList.add('readonly-input');
        }

        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);
    });

    modal.showModal();
};