import type { User, UserRepository } from '@/domain/user'

export class UserCrudUsecase{

    private repository:UserRepository

    constructor(repository:UserRepository){
        this.repository = repository
    }
    async createAccount(user:User){
        return this.repository.create(user)
    }   
    
    async getUser(id:string){
        return this.repository.get(id)
    }  

    async getActiveUser(id:string){
        return this.repository.getActiveUser(id)
    }
    async updateUser(id:string, dataToUpdate:object){
        return this.repository.update(id, dataToUpdate)
    }
    
}
