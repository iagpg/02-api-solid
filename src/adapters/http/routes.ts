import type { FastifyInstance } from "fastify"
import { ZodError } from "zod"
import { EmailAlreadyRegistered, UnkownError, UserNotFound } from "../../core/exeptions/errors"
import { Prisma } from "@prisma/client"
import { UserControllerFactory } from "../factory/user-create.factory"

const userController = UserControllerFactory.getInstance()
const createUser = userController.createUser.bind(userController)
const getUser = userController.getUser.bind(userController)
const desactiveUser = userController.desactivateUser.bind(userController)

export async function appRoutes(app: FastifyInstance) {
    
    app.post('/users',createUser)
    app.get('/users:id',getUser)
    app.patch('/users/desactive:id',desactiveUser)

    app.setErrorHandler((error,_request,reply) =>{
        if (error instanceof ZodError) {
            return reply.status(400).send({message:"validation error",issue: error.format()})
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
            return reply.status(409).send({message: new EmailAlreadyRegistered().message})
        }else if ( error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
            return reply.status(404).send({message: new UserNotFound().message})

        console.error(error)
        return reply.status(500).send(new UnkownError())
    })
}