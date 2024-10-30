import {PartialUserUpdate } from "@/domain/user"
import { z } from "zod"

const schemaUserDTO = z.object({

    name: z.string().min(3).optional(),
    active: z.boolean().optional()

})

export class UpdateUserDTO{

    public name?:string
    public active?:boolean

    constructor(data:z.infer<typeof schemaUserDTO>){
        this.validate(data)
        this.name = data.name
        this.active = data.active
    }

    public toDomain(id:string){
        const user = new PartialUserUpdate(id,this.name,this.active)
        return user
    }

    protected validate(data:z.infer<typeof schemaUserDTO>){
        schemaUserDTO.parse(data)
    }
}