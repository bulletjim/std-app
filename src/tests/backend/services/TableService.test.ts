import * as tableRepository from '@backend/db/tableRepository';
import { saveTable } from '@backend/services/tableService';
import {beforeAll, describe, expect, it, vi} from 'vitest';

vi.mock('@backend/db/tableRepository')

describe("Business Logic: Table Insert", () => {

    beforeAll(() => {
        tableRepository.createDb(':memory');   
    })

    it("Should create a table", async () => {
        vi.mocked(tableRepository.createTable).mockReturnValue(1);
        const response = await saveTable('new table', 'password123');
        
        expect(response.success).toBe(true);
        expect(tableRepository.createTable).toHaveBeenCalledOnce();
    }); 
    
    it("Should return success:false + an error: error if the creation has failed", async () => {
        // @ts-expect-error This is an inducted error
        vi.mocked(tableRepository.createTable).mockReturnValue(null);
        const response = await saveTable('new table', 'bad passwword');
        
        expect(response.success).toBe(false);
        expect(response.error).toBe('Table not created');
    })
});