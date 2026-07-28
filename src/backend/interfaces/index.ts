/**
 * Generic response wrappers for IPC channel communication and internal service operation outcomes.
 * 
 * @module ResponseInterfaces
 */

/**
 * Standardized response envelope sent across IPC channels from the Electron main process to the renderer process.
 * 
 * @template T - Type of the value payload returned upon successful operation execution.
 */
export interface ServerResponse<T>{
    /** Indicates whether the IPC operation succeeded */
    success: boolean,
    /** Optional response data payload, present when `success` is `true` */
    value?: T,
    /** Optional error message explaining failure when `success` is `false` */
    error?: string
}

/**
 * Standardized outcome wrapper returned by internal business service functions.
 * 
 * @template T - Type of the result payload returned upon successful execution.
 */
export interface ServiceResponse<T>{
    /** Indicates whether the business logic operation completed successfully */
    success: boolean,
    /** Optional result payload returned when `success` is `true` */
    value?: T,
    /** Optional error description returned when `success` is `false` */
    error?: string
}