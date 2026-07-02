
export const loadDashboard = async (): Promise<void> => {
    const container = document.getElementById('table-list-container');
    const template = document.getElementById('tpl-table-list-item') as HTMLTemplateElement;

    if (!container || !template) {
        console.error('[DASHBOARD/ERROR]: container or teplate not found');
        return;
    }

    container.innerHTML = '<p>Loading tables...</p>';

    try {
        // TODO: Implement tables fetching

    } catch (error) {
        console.error('[DASHBOARD/ERROR]: ', error);
        container.innerHTML = '<p style="color: red;">Loading Data Failed</p>';
    }
};