/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
    info: (context: string, message: string, data?: any) => {
        console.log(`[${context}] ${message}`, data ? data : '');
        window.logAPI.sendLog('info', context, message, data);
    },
    
    error: (context: string, message: string, error?: any) => {
        console.error(`[${context}] ${message}`, error ? error : '');
        window.logAPI.sendLog('error', context, message, error?.message || error);
    },
    
    warn: (context: string, message: string, data?: any) => {
        console.warn(`[${context}] ${message}`, data ? data : '');
        window.logAPI.sendLog('warn', context, message, data);
    }
};