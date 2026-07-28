/**
 * Frontend utility functions for data formatting, export handling, 
 * and browser-to-IPC log forwarding.
 * 
 * @module FrontendUtils
 */

import { CellValue, DecryptedTableDTO } from "@backend/interfaces/tableTypes";
import { exportTable } from "../api";

/**
 * Converts table columns and row records into an RFC 4180 compliant CSV string.
 * Automatically escapes double quotes and wraps values containing commas or quotes.
 * 
 * @param columns - Array of column header names.
 * @param rows - Array of row objects mapping column names to cell primitive values.
 * @returns A formatted CSV string, or an empty string if no columns exist.
 */
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

/**
 * Prepares table data into CSV and formatted JSON strings and triggers the native OS export dialog.
 * 
 * @param tableData - Decrypted table record containing columns and rows, or `null`.
 * @returns A promise resolving to `true` if export succeeded, or `false` if cancelled/failed.
 */
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