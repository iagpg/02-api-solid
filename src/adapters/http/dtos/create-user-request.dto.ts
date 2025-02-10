import { UserDomain } from "@/domain/user"
import {  z } from "zod"

const schemaUserDTO = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z
        .string()
        .min(6,'A senha deve ter pelo menos 6 caracteres')
        .max(10, 'A senha deve ter no máximo 10 caracteres'),

    active: z.boolean().default(true),
    created_at: z.date().default(new Date)
})

export class CreateUserDTO{

    public name:string
    public email:string
    public password:string
    public active:boolean
    public created_at: Date

    constructor(data:z.infer<typeof schemaUserDTO>){
        this.validate(data)
        this.name = data.name
        this.email = data.email
        this.password = data.password
        this.active = data.active
        this.created_at = data.created_at
    }

    public toDomain(user:CreateUserDTO){
        return new UserDomain(
            user.name,
            user.email,
            user.password,
            user.active,
            user.created_at,
        
        )
    }

    protected validate(data:z.infer<typeof schemaUserDTO>){
        schemaUserDTO.parse(data)
    }
}