import { fetchTableNames } from "../api";
import { navigateTo } from "../router";

export const loadDashboard = async (): Promise<void> => {
    const container = document.getElementById('table-list-container');
    const template = document.getElementById('tpl-table-list-item') as HTMLTemplateElement;

    if (!container || !template) {
        console.error('[DASHBOARD/ERROR]: container or template not found');
        return;
    }

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
        console.error('[DASHBOARD/ERROR]: ', error);
        container.innerHTML = '<p style="color: red;">Loading Data Failed</p>';
    }
};