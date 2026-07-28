/**
 * Frontend logging service providing console output and IPC forwarding to `electron-log`.
 * 
 * @module FrontendLogger
 */

/**
 * Frontend logger interface that outputs messages to the browser console
 * and dispatches log events to the main process via `window.logAPI`.
 */
export const logger = {

    /**
     * Dispatches an informational log event.
     * 
     * @param context - Logical subsystem or component tag (e.g., 'API', 'UI').
     * @param message - Descriptive log message.
     * @param data - Optional dynamic payload or metadata.
     */
    info: (context: string, message: string, data?: unknown) => {
        const dataString = parseData(data);
        console.log(`[${context}] ${message}`, dataString);
        window.logAPI.sendLog('info', context, message, dataString);
    },
    
    /**
     * Dispatches an error log event.
     * 
     * @param context - Logical subsystem or component tag.
     * @param message - Error summary message.
     * @param error - Caught exception or error object.
     */
    error: (context: string, message: string, error?: unknown) => {
        const errorString = parseData(error);
        console.error(`[${context}] ${message}`, errorString);
        window.logAPI.sendLog('error', context, message, errorString);
    },
    
    /**
     * Dispatches a warning log event.
     * 
     * @param context - Logical subsystem or component tag.
     * @param message - Warning summary message.
     * @param data - Optional dynamic metadata.
     */
    warn: (context: string, message: string, data?: unknown) => {
        const dataString = parseData(data);
        console.warn(`[${context}] ${message}`, dataString);
        window.logAPI.sendLog('warn', context, message, dataString);
    }
};

/**
 * Safely converts unknown data structures or errors into printable string format.
 * 
 * @param data - Raw input payload.
 * @returns Safe string representation for logging outputs.
 * @internal
 */
const parseData = (data: unknown): string => {
    if (data === undefined || data === null) return '';
    if (data instanceof Error) return data.message;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') return JSON.stringify(data);
    return String(data);
};