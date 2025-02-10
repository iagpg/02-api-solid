import { UserCrudUsecase } from "@/uses-cases/create-account.use-case"
import { type FastifyReply, type FastifyRequest } from "fastify"
import { UserDTO } from "../dtos/get-user-request.v2.dto"
import { CreateUserDTO } from "../dtos/create-user-request.dto"
import { UpdateUserDTO } from "../dtos/update-user-request.dto"
import { PaginationDTO } from "../dtos/pagination-dto"
import { GetAllUsersDTO } from "../dtos/get-all-users-dto"

export class UserController {    
    private userUseCase:UserCrudUsecase

    constructor(userUseCase: UserCrudUsecase) {
        this.userUseCase = userUseCase
    }
    
    public async createUser(request:FastifyRequest<{Body:CreateUserDTO}>,reply:FastifyReply){

        const userCreateDTO = new CreateUserDTO(request.body)
        const userData = userCreateDTO.toDomain(userCreateDTO)
         
        await this.userUseCase.createAccount(userData)
       
        return reply.status(201).send()
    }

    public async getUser(request:FastifyRequest<{Querystring: {id:string}}>,reply:FastifyReply){
 
        const {id} = request.query
        //full domain data
        const userOutputInfo = await this.userUseCase.getUser(id)
        const userInfo = new UserDTO({
            name: userOutputInfo.name,
            email: userOutputInfo.email,
            active: userOutputInfo.active,
            created_at:userOutputInfo.created_at
        })

        return reply.status(200).send(userInfo)
    }

    public async getAllUsers(request:FastifyRequest<{Querystring:PaginationDTO}>,reply:FastifyReply){

        const {active,take,cursor} = request.query
  
        const params = new PaginationDTO({
            active,take,cursor // to bolean
        })
        const usersPagination = await this.userUseCase.getAllUsers(params.active, params.take, params.cursor)

        const users = new GetAllUsersDTO(usersPagination.users).getUsers
        console.log(usersPagination)
        return reply.status(200).send({
            totalPage:usersPagination.totalPage,
            totalUsers:usersPagination.total,
            currentPage: usersPagination.currentPage,
            cursor: usersPagination.cursor,
            users
        })
    }
    public async updateUser(request:FastifyRequest<{Querystring: {id:string},Body:UpdateUserDTO}>,reply:FastifyReply){
        const {id} = request.query
        const dataToUpdate = request.body
        const userDTO = new UpdateUserDTO({
            name: dataToUpdate.name,
            active: dataToUpdate.active
        })
        const user = userDTO.toDomain(id)
        await this.userUseCase.updateUser(user)

        return reply.status(204).send()
    }

    public async deleteUser(request:FastifyRequest<{Querystring: {id:string}}>,reply:FastifyReply){
        const {id} = request.query
        await this.userUseCase.deleteUser(id)

        return reply.status(204).send({message:'user deleted successfully'})
    }
}