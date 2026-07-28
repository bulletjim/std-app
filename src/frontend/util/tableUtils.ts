import { CellValue, DecryptedTableDTO } from "@backend/interfaces/tableTypes";
import { exportTable } from "../api";

export const formatToCSV = (columns: string[], rows: Record<string, CellValue>[]): string => {
    if (!columns || columns.length === 0) return '';
    let csv = columns.join(',') + '\n';
    rows.forEach(row => {
        const rowValues = columns.map(col => {
            let cellValue = row[col] !== undefined ? String(row[col]) : '';
            if (cellValue.includes(',') || cellValue.includes('"')) {
                cellValue = `"${cellValue.replace(/"/g, '""')}"`;
            }
            return cellValue;
        });
        csv += rowValues.join(',') + '\n';
    });
    return csv;
};

export const handleExport = async (tableData: DecryptedTableDTO | null): Promise<boolean> => {
    if (!tableData || !tableData.decryptedContent) return false;

    const { columns, rows } = tableData.decryptedContent;

    if (columns.length === 0) {
        alert("Nothing to export. Add columns first.");
        return false;
    }


    const csvContent = formatToCSV(columns, rows);
    const jsonContent = JSON.stringify(tableData.decryptedContent, null, 2);
    
    const defaultName = `${tableData.tableName.replace(/\s+/g, '_')}_export`;

    return await exportTable(csvContent, jsonContent, defaultName);
};