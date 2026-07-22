/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';

log.transports.file.format = '[{d}-{m}-{y} {h}:{i}:{s}.{ms}] [{level}] {text}';

export const logger = {
    info: (context: string, message: string, data?: any) => {
        const formattedMessage = `[INFO/${context}] ${message}`;
        log.info(formattedMessage, data ? data : '');
    },
    
    warn: (context: string, message: string, data?: any) => {
        const formattedMessage = `[WARN/${context}] ${message}`;
        log.warn(formattedMessage, data ? data : '');
    },
    
    error: (context: string, message: string, error?: any) => {
        const formattedMessage = `[ERROR/${context}] ${message}`;
        log.error(formattedMessage, error ? error : '');
    }
};