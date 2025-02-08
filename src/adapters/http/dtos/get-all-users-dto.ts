import { UserDomain } from '@/domain/user'
import { UserDTO } from './get-user-request.v2.dto'

export class GetAllUsersDTO {
    
    constructor(public usersData: UserDomain[]) {}

    get getUsers(): UserDTO[] {
        return this.usersData.map(userData => new UserDTO({
            name: userData.name,
            email: userData.email,
            active: userData.active,
            created_at:userData.created_at
        }))
    }
}