import { ZodError, ZodIssue } from "zod"

export class EmailAlreadyRegistered extends Error {
    constructor() {
        super('email already registered')
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