import * as tableRepository from '@backend/db/tableRepository';
import * as securityService from '@backend/services/securityService';
import { checkDeleteTable, saveTable, verifyTableNames } from '@backend/services/tableService';
import {afterEach, beforeAll, describe, expect, it, vi} from 'vitest';

vi.mock('@backend/db/tableRepository');

describe("Business Logic: Table Service", () => {

    beforeAll(() => {
        tableRepository.createDb(':memory');   
    })
    afterEach(() => {
        vi.resetAllMocks();
    })

    it("Should create a table", async () => {
        vi.mocked(tableRepository.createTable).mockReturnValue(1);
        const response = await saveTable('new table', 'password123');
        
        expect(response.success).toBe(true);
        expect(tableRepository.createTable).toHaveBeenCalledOnce();
    }); 
    
    it("Should return success: false + an error: error if the creation has failed", async () => {
        // @ts-expect-error This is an inducted error
        vi.mocked(tableRepository.createTable).mockReturnValue(null);
        const response = await saveTable('new table', 'bad passwword');
        
        expect(response.success).toBe(false);
        expect(response.error).toBe('Table not created');
    })

    it("Should delete table", async () => {
        vi.mocked(tableRepository.getTableById).mockReturnValue({
            id: 1,
            tableName: 'name',
            passwordHash: 'hash',
            passwordSalt: 'salt'
        });

        vi.spyOn(securityService, 'checkPassword').mockResolvedValue(true);

        vi.mocked(tableRepository.deleteTable).mockReturnValue(1);
        const deleteResponse = await checkDeleteTable(1, 'password123');

        expect(deleteResponse.success).toBe(true);
        expect(securityService.checkPassword).toHaveBeenCalledOnce()
        expect(tableRepository.deleteTable).toHaveBeenCalledOnce();
    })

    it("Should fail to delete table if password is wrong", async () => {
        vi.mocked(tableRepository.getTableById).mockReturnValue({
            id: 1,
            tableName: 'name',
            passwordHash: 'hash',
            passwordSalt: 'salt'
        });

        vi.mocked(securityService.checkPassword).mockResolvedValue(false);

        const response = await checkDeleteTable(1, 'password123');
    
        expect(response.success).toBe(false);
        expect(response.error).toBe("Invalid password");
        expect(tableRepository.deleteTable).not.toHaveBeenCalled();
    });

    it("Should return table names", async () => {
        vi.mocked(tableRepository.getAllTableNames).mockReturnValue([
            "table1", "table2", "table3"
        ]);

        const response = await verifyTableNames();
        expect(response?.length).toBe(3);
    });

    it("Should return null if tables are not found", async () => {
        vi.mocked(tableRepository.getAllTableNames).mockReturnValue([]);
        
        const response = await verifyTableNames();
        expect(response).toBe(null);
    })

});