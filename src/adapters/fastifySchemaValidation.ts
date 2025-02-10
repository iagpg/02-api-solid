import { FastifySchema } from "fastify"

export const createUserSchema: FastifySchema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 , maxLength: 10},
            active: { type: 'boolean', default: true }
        }
    }
}

export const getUserSchema: FastifySchema = {
    querystring: {
        type: 'object',
        properties: {
            id: { type: 'string' }
        },
        required: ['id']
    }
}

export const userUpdateSchema: FastifySchema = {
    body:{
        type:'object',
        properties: {
            name: { type: 'string' },
            active: { type: 'boolean'}
        },
        additionalProperties: false
    }
}