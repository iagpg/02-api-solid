import { UserDTO } from "@/adapters/http/dtos/get-user-request.v2.dto"
import { invalidCredentialsError } from "@/core/exeptions/errors"
import { authenticateRequest, UserDomain, UserRepository } from "@/domain/user"
import { compare } from "bcrypt"

export class authenticateCase {
    constructor(private readonly usersRepository: UserRepository){
       
    }

    async authenticate({
        email,
        password
    }:authenticateRequest): Promise<UserDTO>{
    
        const userFound = await this.usersRepository.getByEmail(email)

        if(!userFound) {
            throw new invalidCredentialsError()
        }
        
        const doesPasswordMatches = await compare(password, userFound.password)
        
        if(!doesPasswordMatches) {
            throw new invalidCredentialsError()
        }

        const userDomain = new UserDomain(
            userFound.name,
            userFound.email,
            userFound.password,
            userFound.active,
            userFound.created_at)

        return new UserDTO({
            name: userDomain.name,
            email: userDomain.email,
            active: userDomain.active,
            created_at: userDomain.created_at}) 
        
    }

}