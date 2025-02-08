import {z} from 'zod'

const schemaPaginationDTO = z.object({
    active: z.boolean().default(true),
    skip: z.coerce.number().default(1),
    take: z.coerce.number().default(10)
})

export class PaginationDTO {

    public active:boolean
    public skip:number
    public take:number

    constructor(data:z.infer<typeof schemaPaginationDTO>){
        const validatedData = this.validate(data)
        this.active = data.active
        this.skip = validatedData.skip
        this.take = validatedData.take
    }
    protected validate(data:z.infer<typeof schemaPaginationDTO>){
        
        return schemaPaginationDTO.parse(data)
    }
}