/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';

log.transports.file.format = '[{d}-{m}-{y} {h}:{i}:{s}.{ms}] [{level}] {text}';

export const logger = {
    info: (context: string, message: string, data?: unknown) => {
        const parsedData = parseData(data);
        const formattedMessage = `[INFO/${context}] ${message}`;
        log.info(formattedMessage, parsedData);
    },
    
    warn: (context: string, message: string, data?: unknown) => {
        const parsedData = parseData(data);
        const formattedMessage = `[WARN/${context}] ${message}`;
        log.warn(formattedMessage, parsedData);
    },
    
    error: (context: string, message: string, error?: unknown) => {
        const parsedError = parseData(error);
        const formattedMessage = `[ERROR/${context}] ${message}`;
        log.error(formattedMessage, parsedError);
    }
};

const parseData = (data: unknown): string => {
    if (data === undefined || data === null) return '';
    if (data instanceof Error) return data.message;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') return JSON.stringify(data);
    return String(data);
};