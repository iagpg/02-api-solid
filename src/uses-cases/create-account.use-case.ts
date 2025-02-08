import { EmailAlreadyRegistered, UserNotFound } from '@/core/exeptions/errors'
import {PartialUserUpdate, UserDomain, type UserRepository } from '@/domain/user'

export class UserCrudUsecase{
    constructor(
        private readonly repository:UserRepository){
    }
    async createAccount(user:UserDomain){
        const doesUserExist = await this.repository.getByEmail(user.email)

        if (doesUserExist) {
            throw new EmailAlreadyRegistered
        }
        
        return this.repository.create(user)   
    }   
    
    async getUser(id:string){
        const doesUserExist = await this.repository.getById(id)

        if (!doesUserExist) {
            throw new UserNotFound
        }
        return doesUserExist
    }  

    async getUserByEmail(email:string){
        const doesUserExist = await this.repository.getByEmail(email)

        if (!doesUserExist) {
            throw new UserNotFound
        }
        return doesUserExist
    }

    async updateUser(partialUser:PartialUserUpdate){
        const doesUserExist = await this.repository.getById(partialUser.id)
        if(!doesUserExist){
            throw new UserNotFound
        }
        const userDomain = doesUserExist.userMerge(partialUser)
        await this.repository.update(partialUser.id,userDomain)
    }

    async deleteUser(id:string){
        await this.repository.delete(id)
    }

    async getAllUsers(active:boolean,cursor:string,take:number){
        const allUsers = await this.repository.getAll(active,cursor,take)

        return allUsers
    }
}
