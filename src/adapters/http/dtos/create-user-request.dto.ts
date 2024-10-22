import {z} from 'zod'
import { AbstractDTO } from './abstract.dto'

const schemaUserDTO = z.object({
    name: z.string(),
    password: z.string().min(6),
    email: z.string().email()
})

export class UserDTO extends AbstractDTO<typeof schemaUserDTO> {

    public name:string
    public email:string
    public password:string

    constructor(data:z.infer<typeof schemaUserDTO>){
        super(data)
        
        this.name = data.name
        this.email = data.email
        this.password = data.password
    }
    protected rules(){
        return schemaUserDTO
    }  

}