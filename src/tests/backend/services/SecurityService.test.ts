import { decryptData, encryptData, extractSecreKey, hashPassword } from "@backend/services/securityService";
import { describe, expect, it, vi } from "vitest";
import crypto from 'node:crypto';
import { afterEach } from "node:test";

describe ("Security Tests: Cryptography", () => {

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Password is hashed succesfully and returns pwhash salt and status", async () => {
        const response = await hashPassword('unhashedPassword');

        expect(response.success).toBe(true);
        expect(typeof response.hashedPassword).toBe('string');
        expect(typeof response.salt).toBe('string');

        expect(response.hashedPassword?.length).toBe(128);
        expect(response.salt?.length).toBe(32);
    });

    it("Should return status and message error if password hashing has failed", async () => {

        // Simulates an error
        vi.spyOn(crypto, "randomBytes").mockImplementationOnce(() => {
            throw new Error("Simulated generation error");
        })

        const response = await hashPassword('unhashedPassword');

        expect(response.success).toBe(false);
        expect(response.error).toBe('Error generating password hash');

        expect(response.hashedPassword).toBeUndefined();
        expect(response.salt).toBeUndefined();
    })

    it("Should encrypt content data", () => {

        const mockKeyBufferResult = crypto.randomBytes(32);
        expect(mockKeyBufferResult.length).toBe(32);

        const response = encryptData("{rows:[], columns: []}", mockKeyBufferResult);

        expect(response.success).toBe(true);
        expect(typeof response.encryptedContent).toBe('string');
    })

    it("Should encrypt and decrypt the exact content data", () => {
        
        // Encrypt content
        const content = JSON.stringify({rows: [{id:1, value: "test"}], columns: [{id: 1, value: "Test"}] });
        const secretKey = crypto.randomBytes(32);

        const encryptedResponse = encryptData(content, secretKey);

        expect(encryptedResponse.success).toBe(true);
        expect(typeof encryptedResponse.encryptedContent).toBe('string');
        expect(encryptedResponse.encryptedContent?.split(':').length).toBe(3);

        // Decrypt Content
        const decryptedContentResponse = decryptData(encryptedResponse.encryptedContent as string, secretKey);

        expect(decryptedContentResponse.success).toBe(true);
        expect(decryptedContentResponse.decryptedContent).toBe(content);
    })

    it('Should fail to decrypt if the data is tampered with (GCM Integrity Check)', () => {
        const originalData = "Test123";
        const secretKey = crypto.randomBytes(32);

        const encryptResponse = encryptData(originalData, secretKey);
        
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let tamperedData = encryptResponse.encryptedContent!;

        const lastChar = tamperedData.slice(-1);
        const badChar = lastChar === '0' ? '1' : '0'; 
        tamperedData = tamperedData.slice(0, -1) + badChar;

        const decryptResponse = decryptData(tamperedData, secretKey);

        expect(decryptResponse.success).toBe(false);
        expect(decryptResponse.error).toBe('Error decrypting the content, password invalid or corrupted data');
        expect(decryptResponse.decryptedContent).toBeUndefined();
    });

    it('Should fail to decrypt with the wrong key (Wrong Password)', () => {
        const originalData = "TestData";
        
        const correctKey = crypto.randomBytes(32);
        const wrongKey = crypto.randomBytes(32);

        const encryptResponse = encryptData(originalData, correctKey);
        
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const decryptResponse = decryptData(encryptResponse.encryptedContent!, wrongKey);

        expect(decryptResponse.success).toBe(false);
    });
})