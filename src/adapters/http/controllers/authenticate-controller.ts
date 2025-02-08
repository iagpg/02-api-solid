import { FastifyReply, FastifyRequest } from 'fastify'
import {authenticateCase} from '../../../uses-cases/authenticate.use-case'
import { ServerResponse } from 'node:http'
import { invalidCredentialsError } from '@/core/exeptions/errors'

export class authenticateController {
    private authenticateUseCase: authenticateCase

    constructor(authenticateUseCase: authenticateCase) {
        this.authenticateUseCase = authenticateUseCase
    }

    public async authenticate(request:FastifyRequest,reply:FastifyReply<ServerResponse>){
        try{
        
            const {email,password} = request.query

            const user = this.authenticateUseCase.authenticate({email,password})
            return reply.status(200).send(user)
        
        } catch(error){
            if (error instanceof invalidCredentialsError) {
                return reply.status(401).send()
            }
            if (error instanceof Error){
                console.error('error:',{'name': error.name, 'message': error.message})
            }
            return reply.status(500).send({ error: "Internal Server Error" })
        }
    }
}