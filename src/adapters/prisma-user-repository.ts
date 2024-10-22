import type {ActiveUser, User, UserRepository } from "@/domain/user"
import { prisma } from "@/infra/prisma"
import {Prisma} from '@prisma/client'
import {hash} from 'bcrypt'
export class PrismaUsersRepository implements UserRepository {
    
    async create(newUser: User) :Promise<void> {
        const password_hash = await hash(newUser.password, 6)

        const data:Prisma.UserCreateInput={
            name:newUser.name,
            email:newUser.email,
            password_hash,
        }
            
        await prisma.user.create({
            data
        })
    
    }
    async get(id:string):Promise<User> {

        const user = await prisma.user.findUniqueOrThrow({
            where:{
                id
            }})
        //TODO validate if user exist
        return {
            name:user.name,
            email: user.email,
            password: user.password_hash
        } 
    }
    async getActiveUser(id:string):Promise<ActiveUser>{

        const user = await prisma.user.findUnique({
            where:{id}
        })
        return {active: user?.active ?? false}
    }
    async update(id:string,data:object):Promise<void>{
  
        await prisma.user.update({
            where:{
                id
            },
            data
        })
    }
}