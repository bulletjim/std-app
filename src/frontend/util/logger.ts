export const logger = {
    info: (context: string, message: string, data?: unknown) => {
        const dataString = parseData(data);
        console.log(`[${context}] ${message}`, dataString);
        window.logAPI.sendLog('info', context, message, dataString);
    },
    
    error: (context: string, message: string, error?: unknown) => {
        const errorString = parseData(error);
        console.error(`[${context}] ${message}`, errorString);
        window.logAPI.sendLog('error', context, message, errorString);
    },
    
    warn: (context: string, message: string, data?: unknown) => {
        const dataString = parseData(data);
        console.warn(`[${context}] ${message}`, dataString);
        window.logAPI.sendLog('warn', context, message, dataString);
    }
};

const parseData = (data: unknown): string => {
    if (data === undefined || data === null) return '';
    if (data instanceof Error) return data.message;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') return JSON.stringify(data);
    return String(data);
};