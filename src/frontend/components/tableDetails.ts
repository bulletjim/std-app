/* eslint-disable @typescript-eslint/no-explicit-any */
import { DecryptedTableDTO } from "@backend/interfaces/tableTypes";
import { logger } from "../util/logger";
import { saveTableContent } from "../api";

let currentTableData: DecryptedTableDTO | null = null;
let currentTablePassword: string | null = null;
let isDetailInitialized = false;
let hasUnsavedChanges = false;

export const loadTableDetail = (tableData: DecryptedTableDTO, password: string) => {
    currentTableData = tableData;
    currentTablePassword = password; 
    hasUnsavedChanges = false;
    setupDetailEvents(); 
    renderTable();
};

const renderTable = () => {
    if (!currentTableData) return;
    
    const theadRow = document.getElementById('table-head-row');
    const tbody = document.getElementById('table-body-container');
    const emptyStateContainer = document.getElementById('table-empty-state');
    if (!theadRow || !tbody) return;

    theadRow.innerHTML = '';
    tbody.innerHTML = ''; 

    const hasColumns = currentTableData.decryptedContent.columns && currentTableData.decryptedContent.columns.length > 0;
    const hasRows = currentTableData.decryptedContent.rows && currentTableData.decryptedContent.rows.length > 0;

    if (!hasColumns) {
        if (emptyStateContainer) {
            emptyStateContainer.classList.remove('hidden');
            emptyStateContainer.innerHTML = `
                <div class="empty-state">
                    <p>No column created</p>
                </div>
            `;
        }
        return;
    } 

    emptyStateContainer?.classList.add('hidden');

    currentTableData.decryptedContent.columns.forEach((col, colIndex) => {
        const th = document.createElement('th');
        const thContent = document.createElement('div');
        thContent.className = 'th-content';

        const colNameSpan = document.createElement('span');
        colNameSpan.textContent = col;

        const deleteColBtn = document.createElement('button');
        deleteColBtn.className = 'btn-delete-col';
        deleteColBtn.innerHTML = '&times;'; 
        deleteColBtn.title = `Delete ${col} column`;

        deleteColBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            currentTableData?.decryptedContent.columns.splice(colIndex, 1);
            
            currentTableData?.decryptedContent.rows.forEach(row => {
                delete row[col];
            });
            
            hasUnsavedChanges = true;
            renderTable();
        });

        thContent.appendChild(colNameSpan);
        thContent.appendChild(deleteColBtn);
        th.appendChild(thContent);
        theadRow.appendChild(th);
    });
    
    const thActions = document.createElement('th');
    thActions.textContent = "Actions";
    theadRow.appendChild(thActions);

    if (!hasRows) {
        const emptyTr = document.createElement('tr');
        const emptyTd = document.createElement('td');
        
        emptyTd.colSpan = currentTableData.decryptedContent.columns.length + 1; 
        emptyTd.className = 'empty-table-cell';
        emptyTd.innerHTML = '<em>No data.</em>';
        
        emptyTr.appendChild(emptyTd);
        tbody.appendChild(emptyTr);
        return;
    }

    currentTableData.decryptedContent.rows.forEach((rowData, rowIndex) => {
        const tr = document.createElement('tr');

        currentTableData?.decryptedContent.columns.forEach((col) => {
            const td = document.createElement('td');
            td.textContent = rowData[col] !== undefined ? String(rowData[col]) : '';
            
            td.contentEditable = "true"; 
            
            td.addEventListener('blur', (e) => {
                const newValue = (e.target as HTMLElement).textContent?.trim() || '';
                if(currentTableData) currentTableData.decryptedContent.rows[rowIndex][col] = newValue;
                hasUnsavedChanges = true;
            });

            td.addEventListener('input', () => {
                hasUnsavedChanges = true;
            })

            tr.appendChild(td);
        });

        const tdActions = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'danger-text';
        deleteBtn.addEventListener('click', () => {
            currentTableData?.decryptedContent.rows.splice(rowIndex, 1);
            hasUnsavedChanges = true;
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
    
    const tableNameEl = document.getElementById('detail-title') as HTMLElement;
    if (tableNameEl) {
        tableNameEl.textContent = currentTableData?.tableName as string;
        tableNameEl.contentEditable = "true";
        
        tableNameEl.addEventListener('blur', (e) => {
            const newValue = (e.target as HTMLElement).textContent?.trim() || '';
            if(currentTableData && newValue !== currentTableData.tableName) {
                currentTableData.tableName = newValue;
                hasUnsavedChanges = true;
            }
        });
    }
    
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
                currentTableData.tableName, 
                currentTablePassword,
                currentTableData.decryptedContent,
            );

            if (response) {
                logger.info('TABLE-DETAIL', `Table: ${currentTableData.tableName} modified`);
                hasUnsavedChanges = false;
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
        hasUnsavedChanges = true;
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
                hasUnsavedChanges = true;
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
    hasUnsavedChanges = false;
};

export const confirmDiscardChanges = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!hasUnsavedChanges) {
            resolve(true);
            return;
        }

        const modal = document.getElementById('modal-unsaved-changes') as HTMLDialogElement;
        const btnConfirm = document.getElementById('btn-unsaved-confirm');
        const btnCancel = document.getElementById('btn-unsaved-cancel');

        if (!modal || !btnConfirm || !btnCancel) {
            resolve(true);
            return;
        }

        const handleConfirm = () => {
            cleanup();
            modal.close();
            resolve(true);
        };


        const handleCancel = () => {
            cleanup();
            modal.close();
            resolve(false);
        };

        const cleanup = () => {
            btnConfirm.removeEventListener('click', handleConfirm);
            btnCancel.removeEventListener('click', handleCancel);
        };

        btnConfirm.addEventListener('click', handleConfirm);
        btnCancel.addEventListener('click', handleCancel);

        modal.showModal();
    });
};