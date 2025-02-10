import type { FastifyInstance } from "fastify"
import { EmailAlreadyRegistered, UserNotFound, ZodErrorValidataion } from "../../core/exeptions/errors"
import { authenticateFactory, UserControllerFactory } from "../factory/user-create.factory"
import { createUserSchema, getUserSchema, userUpdateSchema } from "../fastifySchemaValidation"

const userController = UserControllerFactory.getInstance()
const authenticateController = authenticateFactory.getInstance()

const createUser = userController.createUser.bind(userController)
const getUser = userController.getUser.bind(userController)
const updateUser = userController.updateUser.bind(userController)
const deleteUser = userController.deleteUser.bind(userController)
const getAllUsers = userController.getAllUsers.bind(userController)
const authenticate = authenticateController.authenticate.bind(authenticateController)

export async function appRoutes(app: FastifyInstance) {
    
    app.post('/users',{schema:createUserSchema}, createUser)
    app.get('/users/:id',{schema:getUserSchema},getUser)
    app.patch('/users/:id',{schema:userUpdateSchema},updateUser)
    app.delete('/users/:id',deleteUser)
    app.get('/users/all',getAllUsers)
    app.get('/users/authenticate',authenticate)

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
        console.error('error informattion',error)
        return reply.status(500).send({'name': error.name,'message': error.message})
    })
}