import { z } from "zod"

const schemaUserDTO = z.object({
    name: z.string(),
    email: z.string().email()
})

export class UserDTO{

    public name:string
    public email:string

    constructor(data:z.infer<typeof schemaUserDTO>){
        this.validate(data)
        this.name = data.name
        this.email = data.email

    }

    protected validate(data:z.infer<typeof schemaUserDTO>){
        
        schemaUserDTO.parse(data)
    }
}