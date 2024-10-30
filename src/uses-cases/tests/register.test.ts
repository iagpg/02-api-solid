import {describe, it,expect} from 'vitest'
import { UserCrudUsecase } from '../create-account.use-case'
import { PrismaUsersRepository } from '@/adapters/prisma-user-repository'
import { UserDomain } from '@/domain/user'
import { Prisma } from '@prisma/client'

describe('Register Use Case', ()=>{

    const prismaAdapter = new PrismaUsersRepository()
    const userCrud = new UserCrudUsecase(prismaAdapter)

    const id:string = '4a9c47d9-3f97-460b-9add-b2ebcafe76cb'
    
    const user = new UserDomain(
        'iago',
        'iago222122@gmail.com',
        '12345',
        true)

    it('should create an account',async ()=>{
        try {
            await userCrud.createAccount(user)
        } catch (error) {
            expect(error).instanceOf(Prisma.PrismaClientKnownRequestError)
            expect((error as Prisma.PrismaClientKnownRequestError).code).toBe('P2002')
        }
     
    })
    it('should get user data',async ()=>{
        const userRetrieved = await userCrud.getUser(id)
        expect(userRetrieved).toBeDefined()
        console.log(userRetrieved)

    })

    it('should update user',async ()=>{
        
        await userCrud.updateUser({id,name:'iag'})
        const userRetrieved = await userCrud.getUser(id)

        expect(userRetrieved.name).toEqual('iag')
    })
})