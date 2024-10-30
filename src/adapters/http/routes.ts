import type { FastifyInstance } from "fastify"
import { EmailAlreadyRegistered, UnkownError, UserNotFound, ZodErrorValidataion } from "../../core/exeptions/errors"
//import { Prisma } from "@prisma/client"
import { UserControllerFactory } from "../factory/user-create.factory"

const userController = UserControllerFactory.getInstance()
const createUser = userController.createUser.bind(userController)
const getUser = userController.getUser.bind(userController)
const updateUser = userController.updateUser.bind(userController)
const deleteUser = userController.deleteUser.bind(userController)

export async function appRoutes(app: FastifyInstance) {
    
    app.post('/users',createUser)
    app.get('/users:id',getUser)
    app.patch('/users:id',updateUser)
    app.delete('/users:id',deleteUser)

    app.setErrorHandler((error,_request,reply) =>{
        
        if (error instanceof EmailAlreadyRegistered){
            return reply.status(409).send({message: new EmailAlreadyRegistered().message})
        }
        else if ( error instanceof UserNotFound){
            return reply.status(404).send({message: new UserNotFound().message})
        }
        else if (error instanceof ZodErrorValidataion) {
            return reply.status(400).send({message:"validation error",issue: error.format()})
        }
        console.error(error)
        return reply.status(500).send(new UnkownError())
    })
}