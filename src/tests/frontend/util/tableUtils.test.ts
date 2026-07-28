/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatToCSV, handleExport } from '@frontend/util/tableUtils';
import { DecryptedTableDTO } from '@backend/interfaces/tableTypes';
import { exportTable } from '@frontend/api';

vi.mock('@frontend/api');

beforeEach(() => {
    global.alert = vi.fn();
    vi.clearAllMocks(); 
    
    vi.mocked(exportTable).mockResolvedValue(true);
});

describe('Table Utils - formatToCSV', () => {
    it('should correctly format columns and rows into a CSV string', () => {
        const columns = ['Username', 'Email'];
        const rows = [
            { Username: 'admin', Email: 'admin@test.com' },
            { Username: 'user1', Email: 'user1@test.com' }
        ];

        const csv = formatToCSV(columns, rows);
        const expected = "Username,Email\nadmin,admin@test.com\nuser1,user1@test.com\n";

        expect(csv).toBe(expected);
    });

    it('should handle and escape commas and double quotes in values', () => {
        const columns = ['Note'];
        const rows = [
            { Note: 'Hello, world!' },
            { Note: 'He said "Good morning"' }
        ];

        const csv = formatToCSV(columns, rows);

        expect(csv).toContain('"Hello, world!"');
        expect(csv).toContain('"He said ""Good morning"""');
    });

    it('should return an empty string if there are no columns', () => {
        const csv = formatToCSV([], []);
        expect(csv).toBe('');
    });
});

describe('tableUtils - handleExport', () => {
    it('should block the export and return false if the table has no columns', async () => {
        const mockData: DecryptedTableDTO = {
            id: 1,
            tableName: 'Empty Table',
            decryptedContent: { columns: [], rows: [] }
        };

        const result = await handleExport(mockData);

        expect(result).toBe(false);
        expect(exportTable).not.toHaveBeenCalled();
    });

    it('should generate both CSV and JSON and call the Electron API with the correct file name', async () => {
        const mockData: DecryptedTableDTO = {
            id: 1,
            tableName: 'My Accounts',
            decryptedContent: {
                columns: ['Site', 'Pass'],
                rows: [{ Site: 'Google', Pass: '1234' }]
            }
        };

        const result = await handleExport(mockData);

        expect(result).toBe(true);
        expect(exportTable).toHaveBeenCalledTimes(1);

        const [csvContent, jsonContent, defaultName] = vi.mocked(exportTable).mock.calls[0];

        expect(csvContent).toContain('Site,Pass');
        expect(jsonContent).toContain('"Site": "Google"');
        expect(defaultName).toBe('My_Accounts_export');
    });
});