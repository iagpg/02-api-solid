import {z, ZodType} from 'zod'

export abstract class AbstractDTO<Schema extends ZodType>  {
    private data: z.infer<Schema> 

    protected abstract rules():Schema

    public constructor(data: Record<string,unknown>) {
        
        this.data = data
        this.validate(data)
    }

    protected abstract getData():unknown

    protected validate(data: Record<string,unknown>){
        this.data = this.rules().parse(data)

    }
}