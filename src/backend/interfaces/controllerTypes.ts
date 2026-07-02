export interface ServerResponse<T>{
    success: boolean,
    value?: T,
    error?: string
}