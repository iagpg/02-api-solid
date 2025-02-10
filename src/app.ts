import  fastify  from 'fastify'
import { appRoutes } from './adapters/http/routes'

export const app = fastify()

app.register(appRoutes)
