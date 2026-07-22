import * as tableRepository from '@backend/db/tableRepository';
import { TableDTO } from '@backend/interfaces/tableTypes';
import * as securityService from '@backend/services/securityService';
import { checkDeleteTable, checkSelectedTable, saveTable, verifyTableNames } from '@backend/services/tableService';
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
        // Mocked tables
        const table1: TableDTO = {
            id: 1,
            tableName: "table1",
            passwordHash: 'hash',
            passwordSalt: 'salt'
        }
        const table2: TableDTO = {
            id: 2,
            tableName: "table2",
            passwordHash: 'hash',
            passwordSalt: 'salt'
        }
        const table3: TableDTO = {
            id: 3,
            tableName: "table3",
            passwordHash: 'hash',
            passwordSalt: 'salt'
        }
        vi.mocked(tableRepository.getAllTableInfos).mockReturnValue([
            table1, table2, table3
        ]);

        const response = await verifyTableNames();
        expect(response?.length).toBe(3);
    });

    it("Should return null if tables are not found", async () => {
        vi.mocked(tableRepository.getAllTableInfos).mockReturnValue([]);
        
        const response = await verifyTableNames();
        expect(response).toBe(null);
    })

    it("Should access a table if password is valid", async () => {
        vi.mocked(tableRepository.getTableById).mockReturnValue({
            id:1,
            tableName: "table1",
            passwordHash: "hash",
            passwordSalt: "salt"
        })
        vi.spyOn(securityService, 'checkPassword').mockResolvedValue(true);
        vi.spyOn(securityService, 'hashPassword').mockResolvedValue({
            success: true,
            hashedPassword: "fake_hash",
            salt: "fake_salt"
        });
        vi.spyOn(securityService, 'extractSecreKey').mockResolvedValue(Buffer.from("fake_secret_key"));
        vi.spyOn(securityService, 'decryptData').mockReturnValue({
            success: true,
            decryptedContent: '{"columns": ["ID"], "rows": [{"ID": 1}]}' 
        });
        const result = await checkSelectedTable(1, 'password');

        expect(result.success).toBe(true);
        expect(result.value).toBeDefined();

        expect(result.value?.tableName).toBe("table1");
        expect(result.value?.decryptedContent.columns.length).toBeGreaterThan(0);

    
    })

    it("Should deny access to a table if password is invalid", async () => {
        vi.mocked(tableRepository.getTableById).mockReturnValue({
            id:1,
            tableName: "table1",
            passwordHash: "hash",
            passwordSalt: "salt"
        })
        vi.spyOn(securityService, 'checkPassword').mockResolvedValue(false);
        const result = await checkSelectedTable(1, 'password');

        expect(result.success).toBe(false);
        expect(result.value).toBeUndefined();

        expect(result.error).toBe("Password is invalid")

    
    })

    it("Should return an error if table is not found", async () => {
    vi.mocked(tableRepository.getTableById).mockReturnValue(null);

    const result = await checkSelectedTable(999, 'password');

    expect(result.success).toBe(false);
    expect(result.error).toBe("Table not found");
    
    expect(securityService.checkPassword).not.toHaveBeenCalled();
    });

});