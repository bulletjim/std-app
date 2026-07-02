export interface ServiceResponse<T>{
    success: boolean,
    value?: T,
    error?: string
}

export interface PasswordResponse{
    success: boolean,
    hashedPassword?: string,
    salt?: string,
    error?: string 
}
