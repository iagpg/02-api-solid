import type {UserRepository } from '@/domain/user'

export class UserCrudUsecase{
    
    private repository:UserRepository

    constructor(repository:UserRepository){
        this.repository = repository
    }
    async getUser(id:string){
        return this.repository.get(id)
    }   
    
}
