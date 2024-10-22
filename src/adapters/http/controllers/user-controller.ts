import { UserCrudUsecase } from "@/uses-cases/create-account.use-case"
import type { FastifyReply, FastifyRequest } from "fastify"
import type { ServerResponse } from "node:http"
import { UserDTO } from "../dtos/create-user-request.dto"
import type {User} from "@/domain/user"
import { GetUserDTOv2 } from "../dtos/get-user-request.v2.dto"

export class UserController {    
    private userCase:UserCrudUsecase

    constructor(userCase: UserCrudUsecase) {
        this.userCase = userCase
    }
    
    public async createUser(request:FastifyRequest,reply:FastifyReply<ServerResponse>){

        //  const myDto:UserDTO  = request.body
        //  console.log(myDto)
        const userCreateDTO = new UserDTO(request.body)
     
        const newUserDomain:User = {
            
            name: userCreateDTO.name,
            email:userCreateDTO.email,
            password:userCreateDTO.password
        }
        await this.userCase.createAccount(newUserDomain)
       
        return reply.status(201).send()
    }

    public async getUser(request:FastifyRequest,reply:FastifyReply<ServerResponse>){

        const {id} = request.query
        //full domain data
        const userOutputInfo = await this.userCase.getUser(id)
        const userInfo = new GetUserDTOv2({
            name: userOutputInfo.name,
            email: userOutputInfo.email
        })

        return reply.status(200).send(userInfo)
    }

    public async desactivateUser(request:FastifyRequest,reply:FastifyReply<ServerResponse>){
        const {id} = request.query

        const userActive = await this.userCase.getActiveUser(id)

        if (userActive.active === true){
            await this.userCase.updateUser(id,{active: false})

        }
        return reply.status(200).send({message:'user desactived successfully'})
    }
}