export interface ServerResponse<T>{
    success: boolean,
    value?: T,
    error?: string
}

export interface ServiceResponse<T>{
    success: boolean,
    value?: T,
    error?: string
}