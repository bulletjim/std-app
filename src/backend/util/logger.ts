/**
 * Backend logging service using `electron-log` for formatted file and console output.
 * @module BackendLogger
 */

import log from 'electron-log';

log.transports.file.format = '[{d}-{m}-{y} {h}:{i}:{s}.{ms}] [{level}] {text}';

/**
 * Leveled logging utility providing structured context tagging and dynamic data serialization.
 */
export const logger = {

    /**
     * Logs informational events.
     * 
     * @param context - Logical subsystem originating the event (e.g., 'DB', 'SECURITY').
     * @param message - Brief summary of the event.
     * @param data - Optional metadata or payload attached to the log.
     */
    info: (context: string, message: string, data?: unknown) => {
        const parsedData = parseData(data);
        const formattedMessage = `[INFO/${context}] ${message}`;
        log.info(formattedMessage, parsedData);
    },

    /**
     * Logs non-fatal warning events.
     * 
     * @param context - Logical subsystem originating the event.
     * @param message - Description of the warning condition.
     * @param data - Optional diagnostic metadata.
     */
    warn: (context: string, message: string, data?: unknown) => {
        const parsedData = parseData(data);
        const formattedMessage = `[WARN/${context}] ${message}`;
        log.warn(formattedMessage, parsedData);
    },
    
    /**
     * Logs runtime errors and exceptions.
     * 
     * @param context - Logical subsystem originating the error.
     * @param message - High-level summary of the failure.
     * @param error - Exception instance, error string, or unknown thrown object.
     */
    error: (context: string, message: string, error?: unknown) => {
        const parsedError = parseData(error);
        const formattedMessage = `[ERROR/${context}] ${message}`;
        log.error(formattedMessage, parsedError);
    }
};

/**
 * Internal helper function to safely extract and stringify unknown payloads.
 * 
 * @param data - The raw unknown value to evaluate.
 * @returns A safe, stringified representation suitable for log outputs.
 * @internal
 */
const parseData = (data: unknown): string => {
    if (data === undefined || data === null) return '';
    if (data instanceof Error) return data.message;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') return JSON.stringify(data);
    return String(data);
};