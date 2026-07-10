import { logger } from "../util/logger";
import { deleteSelectedTable, fetchTableNames } from "../api";
import { navigateTo } from "../router";

let isModalInitialized = false;

export const loadDashboard = async (): Promise<void> => {
    const container = document.getElementById('table-list-container');
    const template = document.getElementById('tpl-table-list-item') as HTMLTemplateElement;

    if (!container || !template) {
        logger.error('DASHBOARD', 'container or template not found');
        return;
    }
    
    setupModalEvents();

    try {
        const tables = await fetchTableNames();

        if (!tables || tables.length === 0) {
            container.innerHTML = '<p id="empty-message">No Tables Found. Create a table first.</p>';
            return;
        }

        const emptyMessage = document.getElementById('empty-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        const validTableIds = new Set(tables.map(t => `table-item-${t.tableName}`));

        tables.forEach((table) => {
            const elementId = `table-item-${table.tableName}`;
            const existingElement = document.getElementById(elementId);

            if (existingElement) {
                return; 
            }

            const tableTemplate = template.content.cloneNode(true) as DocumentFragment;
            
            const rootNode = tableTemplate.firstElementChild as HTMLElement;
            if (rootNode) rootNode.id = elementId;

            const tableNameEl = tableTemplate.querySelector('.tpl-name');
            if (tableNameEl) tableNameEl.textContent = table.tableName;

            const openBtn = tableTemplate.querySelector('.tpl-btn-open');
            const deleteBtn = tableTemplate.querySelector('.tpl-btn-delete');

            openBtn?.addEventListener('click', () => {
                navigateTo('view-table-detail');
            });
                
            deleteBtn?.addEventListener('click', () => {
                const modal = document.getElementById('modal-confirm') as HTMLDialogElement;
                const confirmBtn = document.getElementById('btn-modal-confirm') as HTMLButtonElement;
                const passwordInput = document.getElementById('modal-password-input') as HTMLInputElement;
                if(confirmBtn) {
                    confirmBtn.setAttribute('data-target-id', table.id.toString());
                }
                if(passwordInput){
                    passwordInput.value = '';
                }

                modal?.showModal();
            });

            container.appendChild(tableTemplate);
        });

        Array.from(container.children).forEach((child) => {
            if (!validTableIds.has(child.id)) {
                child.remove();
            }
        });

    } catch (error) {
        logger.error('DASHBOARD', 'Context Change Failed', error);
        container.innerHTML = '<p style="color: red;">Loading Data Failed</p>';
    }
};

const setupModalEvents = () => {
    if (isModalInitialized) return;

    const modal = document.getElementById('modal-confirm') as HTMLDialogElement;
    const confirmBtn = document.getElementById('btn-modal-confirm');
    const cancelBtn = document.getElementById('btn-modal-cancel');

    cancelBtn?.addEventListener('click', () => {
        modal.close();
    });

    confirmBtn?.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        const passwordInput = document.getElementById('modal-password-input') as HTMLInputElement;
        
        const tableId = target.getAttribute('data-target-id');
        const password = passwordInput?.value;

        if (!password) {
            alert("Please insert table password");
            return;
        }

        if (tableId && password) {
            logger.warn('DASHBOARD', `Requested table deletion id: ${tableId}`);
            
            try {
                const result = await deleteSelectedTable(Number(tableId), password);
                
                if (result) {
                    modal.close();
                    logger.info('DASHBOARD', `Table: ${tableId} deleted succesfully`);
                    await loadDashboard();
                } else {
                    logger.warn('DASHBOARD', 'Password provided is not valid');
                    alert("Password provided is not valid");
                }        
            } catch (error) {
                logger.error('DASHBOARD', 'Table deletion has failed', error);
            }
        }
    });

    isModalInitialized = true;
};