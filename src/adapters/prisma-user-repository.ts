import { EmailAlreadyRegistered, UnkownError } from "@/core/exeptions/errors"
import {UserDomain, type UserRepository } from "@/domain/user"
import { prisma } from "@/infra/prisma"
import {Prisma} from '@prisma/client'
import {hash} from 'bcrypt'
export class PrismaUsersRepository implements UserRepository {
    
    async create(newUser: UserDomain) :Promise<void> {
        const password_hash = await hash(newUser.password, 6)

        const data:Prisma.UserCreateInput={
            name:newUser.name,
            email:newUser.email,
            password_hash,
            active:true
        }
            
        await prisma.user.create({
            data
        })
    
    }
    async get(id:string):Promise<UserDomain> {
        try{
            const user = await prisma.user.findUniqueOrThrow({
                where:{
                    id
                }})

            return new UserDomain(user.name,
                user.email,
                user.password_hash,
                user.active)

        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new EmailAlreadyRegistered()
            }
            throw new UnkownError()
        }
    }
   
    async update(id:string,user:UserDomain):Promise<void>{
            
        await prisma.user.update({
            where:{
                id
            },
            data:{
                name:user.name,
                active:user.active
            }
        })
    }
    async delete(id:string){
        await prisma.user.delete({
            where:{
                id
            }
        })
    }
}