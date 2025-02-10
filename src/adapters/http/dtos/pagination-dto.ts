import {z} from 'zod'

const schemaPaginationDTO = z.object({
    active: z.boolean().default(true),
    take: z.coerce.number().default(10),
    cursor: z.string().optional()
})

export class PaginationDTO {

    public active:boolean
    public take:number
    public cursor?:string

    constructor(data:z.infer<typeof schemaPaginationDTO>){
        const validatedData = this.validate(data)
        this.active = data.active
        this.take = validatedData.take
        this.cursor = validatedData.cursor
    }
    protected validate(data:z.infer<typeof schemaPaginationDTO>){
        
        return schemaPaginationDTO.parse(data)
    }
}