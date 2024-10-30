import { UserCrudUsecase } from "@/uses-cases/create-account.use-case"
import type { FastifyReply, FastifyRequest } from "fastify"
import type { ServerResponse } from "node:http"
import { UserDTO } from "../dtos/get-user-request.v2.dto"
import { CreateUserDTO } from "../dtos/create-user-request.dto"
import { UpdateUserDTO } from "../dtos/update-user-request.dto"

export class UserController {    
    private userCase:UserCrudUsecase

    constructor(userCase: UserCrudUsecase) {
        this.userCase = userCase
    }
    
    public async createUser(request:FastifyRequest,reply:FastifyReply<ServerResponse>){

        const userCreateDTO = new CreateUserDTO(request.body)
        // const userData = new UserDomain(
        //     userCreateDTO.name,
        //     userCreateDTO.email,
        //     userCreateDTO.password,
        //     true)
        const userData = userCreateDTO.toDomain(userCreateDTO)
         
        await this.userCase.createAccount(userData)
       
        return reply.status(201).send()
    }

    public async getUser(request:FastifyRequest,reply:FastifyReply<ServerResponse>){

        const {id} = request.query
        //full domain data
        const userOutputInfo = await this.userCase.getUser(id)
        const userInfo = new UserDTO({
            name: userOutputInfo.name,
            email: userOutputInfo.email
        })

        return reply.status(200).send(userInfo)
    }

    public async updateUser(request:FastifyRequest,reply:FastifyReply<ServerResponse>){
        const {id} = request.query
        const DataToUpdate = request.body

        const userDTO = new UpdateUserDTO({
            name: DataToUpdate.name,
            active: DataToUpdate.active
        }) 
        const user = userDTO.toDomain(id)
        await this.userCase.updateUser(user)

        return reply.status(204).send()
    }

    public async deleteUser(request:FastifyRequest,reply:FastifyReply<ServerResponse>){
        const {id} = request.query
        await this.userCase.deleteUser(id)

        return reply.status(204).send({message:'user deleted successfully'})
    }
}