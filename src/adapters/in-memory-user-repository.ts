import { PartialUserUpdate, UserAggregator, UserDomain, UserRepository } from "@/domain/user"
import { Prisma } from "@prisma/client"

export class InMemoryUserRepo implements UserRepository{

    public items: Prisma.UserCreateInput[] = []
    
    async create(newUser: UserDomain) {
        const user = {
            id: crypto.randomUUID(),
            name:newUser.name,
            email:newUser.email,
            password_hash: newUser.password,
            active: newUser.active,
            created_at: newUser.created_at
        }
        this.items.push(user)
        
        return new UserDomain(user.name,
            user.email,
            user.password_hash,
            user.active,
            user.created_at
        )
      
    };
    async getUserIdByEmail(email:string){
        const user = this.items.find((items) => items.email === email)
        if(!user) throw new Error('id not found')
        return user.id
    }
    async update (id: string, userData: UserDomain) {
        const userIndex = this.items.findIndex(user => user.id === id)

        if (userIndex === -1) {
            throw new Error('user not found')
        }
        const updatedUser = {
            id: this.items[userIndex].id,
            name: userData.name,
            email:this.items[userIndex].email,
            password_hash: this.items[userIndex].password_hash,
            active:userData.active,
            created_at: this.items[userIndex].created_at,
            updated_at: new Date()

        }
        this.items[userIndex] = updatedUser
        return new PartialUserUpdate(this.items[userIndex].id!,userData.name,userData.active )
    };

    async getById (id: string){
        const user = this.items.find((item)=> item.id == id)

        if (!user){
            throw new Error('user not found')
        }
        return new UserDomain(user.name,
            user.email,
            user.password_hash,
            user.active || false,
            user.created_at as Date)
    };

    async getByEmail (email: string){
        const user = this.items.find((item)=> item.email == email)

        if (!user){
            throw new Error('user not found')
        }
        return new UserDomain(user.name,
            user.email,
            user.password_hash,
            user.active || false,
            user.created_at as Date)
    };

    async delete (id: string){
        const userIndex = this.items.findIndex(user => user.id === id)

        if (userIndex === -1) {
            throw new Error('user not found')
        }
        this.items.splice(userIndex, 1)
    }
    async getAll (active: boolean, cursor:string, take: number){

        const skip = isNaN(parseInt(cursor)) ? 0 : parseInt(cursor)

        const users:UserDomain[] = []
        for (let index = skip; index < take; index++ ){

            users.push(new UserDomain(
                this.items[index].name,
                this.items[index].email,
                this.items[index].password_hash,
                this.items[index].active || true,
                this.items[index].created_at as Date
            ))

        }
        return new UserAggregator(users, skip, users.length)
    }
}