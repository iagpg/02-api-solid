
export class UserDomain{

    constructor(
        public name:string,
        public email: string,
        public password: string,
        public active:boolean
    ){

    }
    public userMerge(user:PartialUserUpdate){

        if(user.name) this.name = user.name 
        if (user.active) this.active = user.active
    
        return this
    }
}

export class PartialUserUpdate{

    constructor(public id:string, public name?:string, public active?:boolean){
    }
}

export interface UserRepository{
    create: (newUser:UserDomain)=>Promise<void>
    update: (id:string,userData:UserDomain)=>Promise<void>
    get: (id:string)=>Promise<UserDomain>
    delete: (id:string)=>Promise<void>
}