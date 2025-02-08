import { z } from "zod"

const schemaUserDTO = z.object({
    name: z.string(),
    email: z.string().email(),
    active: z.boolean(),
    created_at:z.date()
})

export class UserDTO{

    public name:string
    public email:string
    public active:boolean
    public created_at:Date

    constructor(data:z.infer<typeof schemaUserDTO>){
        this.validate(data)
        this.name = data.name
        this.email = data.email
        this.active = data.active
        this.created_at = data.created_at

    }

    protected validate(data:z.infer<typeof schemaUserDTO>){
        
        schemaUserDTO.parse(data)
    }

}