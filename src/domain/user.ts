
export class UserDomain{

    constructor(
        public name:string,
        public email: string,
        public password: string,
        public active:boolean,
        public created_at:Date
    ){

    }
    // user information that can be updated
    public userMerge(user:PartialUserUpdate){

        if(user.name !== undefined) this.name = user.name 
        if (user.active !== undefined) this.active = user.active
        return this
    }
}

export class authenticateRequest{
    constructor(public email:string, public password:string){

    }
}

export class PartialUserUpdate{

    constructor(public id:string, public name?:string, public active?:boolean){
    }
}

export class UserAggregator {

    constructor(public users: UserDomain[],  public totalPage: number, public total: number, public cursor?:string, public currentPage?: number,) {
    }
}

export interface UserRepository{
    create: (newUser:UserDomain)=>Promise<UserDomain>
    update: (id:string,userData:UserDomain)=>Promise<PartialUserUpdate>
    getById: (id:string)=>Promise<UserDomain | undefined>
    getByEmail: (email:string)=>Promise<UserDomain | undefined>
    delete: (id:string)=>Promise<void>

    getAll: (active:boolean , cursor:string, take:number)=>Promise<UserAggregator>
}