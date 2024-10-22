import {z} from 'zod'
import { AbstractDTO } from './abstract.dto'

const schemaUserDTO = z.object({
    name: z.string(),
    email: z.string().email()
})

export class GetUserDTO extends AbstractDTO<typeof schemaUserDTO> {

    public name:string
    public email:string

    constructor(data:z.infer<typeof schemaUserDTO>){
        super(data)
        this.name = data.name
        this.email = data.email
    }

    public getData(){
        return {
            name:this.name,
            email:this.email
        }
    }
    
    protected rules(){
        return schemaUserDTO
    }  

}