import { ZodError, ZodIssue } from "zod"

export class EmailAlreadyRegistered extends Error {
    constructor() {
        super('email already in use')
    }
    
}

export class UnkownError extends Error{
    
    constructor() {
        super('An unknown error occurred')
    }
}

export class UserNotFound extends Error{
    
    constructor() {
        super('User not found')
    }
}

export class invalidCredentialsError extends Error{
    
    constructor() {
        super('email or password is incorrect')
        this.name = 'InvalidCredentialsError'
    }
}
export class UserAlreadyDesactived extends Error{
    
    constructor() {
        super('User already Desactived')
    }
}

export class ZodErrorValidataion extends ZodError{
    constructor(issues: ZodIssue[] = []) {
        super(issues)
    }
}