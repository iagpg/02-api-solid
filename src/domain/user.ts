
export interface User{

    name:string
    email: string
    password: string

}

export interface ActiveUser{
    active:boolean
}

export interface UserRepository{
    create: (newUser:User)=>Promise<void>
    get: (id:string)=>Promise<User>
    update:(id:string, dataToUpdate:object)=>Promise<void>
    getActiveUser:(id:string)=> Promise<ActiveUser>
}