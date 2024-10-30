import {PartialUserUpdate, UserDomain, type UserRepository } from '@/domain/user'

export class UserCrudUsecase{
    constructor(
        private readonly repository:UserRepository){
    }
    async createAccount(user:UserDomain){
        await this.repository.create(user)
    }   
    
    async getUser(id:string){
        return await this.repository.get(id)
    }  

    async updateUser(partialUser:PartialUserUpdate){
        const user = await this.getUser(partialUser.id)
        const userDomain = user.userMerge(partialUser)
        await this.repository.update(partialUser.id,userDomain)
    }

    async deleteUser(id:string){
        this.repository.delete(id)
    }
}
