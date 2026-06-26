export interface ServiceResponse<T>{
    success: boolean,
    value?: T,
    error?: string
}