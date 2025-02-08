import { EmailAlreadyRegistered, UnkownError } from "@/core/exeptions/errors"
import {PartialUserUpdate, UserAggregator, UserDomain, type UserRepository } from "@/domain/user"
import { prisma } from "@/infra/prisma"
import {Prisma} from '@prisma/client'
import {hash} from 'bcrypt'

export class PrismaUsersRepository implements UserRepository {
    
    async create(newUser: UserDomain) :Promise<UserDomain> {

        try{       
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
            return new UserDomain(data.name,data.email,password_hash,true,new Date())
        
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new EmailAlreadyRegistered()
            }
            throw new UnkownError()
        }
     
    }
    async getById(id:string) {
        try{
            const user = await prisma.user.findUnique({
                where:{
                    id
                }})
            if (user){
                return new UserDomain(user.name,
                    user.email,
                    user.password_hash,
                    user.active,
                    user.created_at)
    
            }
            
        } catch (error){
            
            console.error('Ocorreu um erro: ',error)
            throw new UnkownError()
        }
        return undefined
    }
    async getByEmail(email:string){
        try{
            const user = await prisma.user.findUnique({
                where:{
                    email
                }})

            if (user){
                return new UserDomain(user.name,
                    user.email,
                    user.password_hash,
                    user.active,
                    user.created_at)
            }  
            
        } catch (error){
            
            console.error('Ocorreu um erro: ',error)
            throw new UnkownError()
        }
        return undefined
    }

    async getAll(active: boolean, cursor: string | undefined, take: number) {
        const total = await prisma.user.count({
            where: { active },
        })

        const queryOptions: Prisma.UserFindManyArgs = {
            select: {
                id: true,
                name: true,
                email: true,
                active: true,
                created_at: true,
                password_hash: true,
            },
            take,
            where: {
                active,
            },
            orderBy: [
                { created_at: 'desc' },
                { id: 'desc' } 
            ],
        }
    
        if (cursor) {
            queryOptions.cursor = { id: cursor }
            queryOptions.skip = 1 // Ignorar o registro do cursor atual
        }
    
        const users = await prisma.user.findMany(queryOptions)
    
        const totalPage = Math.ceil(total / take)
    
        const toDomain = users.map(
            (userData) =>
                new UserDomain(
                    userData.name,
                    userData.email,
                    userData.password_hash,
                    userData.active,
                    userData.created_at
                )
        )
    
        const nextCursor = users.length === take ? users[users.length - 1].id : undefined

        // Calcula a página atual baseada na quantidade de registros já carregados
        const recordsLoaded = await prisma.user.count({
            where: {
                active,
                created_at: {
                    lte: users[users.length - 1]?.created_at, // Conta registros até o último da página atual
                },
            },
        })

        const currentPage = cursor ? totalPage - Math.ceil((recordsLoaded - users.length) / take) : 1
     
        return new UserAggregator(toDomain, totalPage, total, nextCursor, currentPage)
    }
   
    async update(id:string,user:UserDomain):Promise<PartialUserUpdate>{
            
        const updatedUser = await prisma.user.update({
            where:{
                id
            },
            data:{
                name:user.name,
                active:user.active
            }
        })
        return new PartialUserUpdate(
            id,
            updatedUser.name,
            updatedUser.active
        )
    }
    async delete(id:string){
        await prisma.user.delete({
            where:{
                id
            }
        })
    }
}