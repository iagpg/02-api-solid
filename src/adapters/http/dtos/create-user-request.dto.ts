import { UserDomain } from "@/domain/user"
import { z } from "zod"

const schemaUserDTO = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    active: z.boolean().default(true)
})

export class CreateUserDTO{

    public name:string
    public email:string
    public password:string
    public active:boolean

    constructor(data:z.infer<typeof schemaUserDTO>){
        this.validate(data)
        this.name = data.name
        this.email = data.email
        this.password = data.password
        this.active = data.active
    }

    public toDomain(user:CreateUserDTO){
        return new UserDomain(
            user.name,
            user.email,
            user.password,
            user.active
        )
    }

    protected validate(data:z.infer<typeof schemaUserDTO>){
        schemaUserDTO.parse(data)
    }
}