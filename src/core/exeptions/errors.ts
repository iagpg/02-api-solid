
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