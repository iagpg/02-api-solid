import { UserController } from "@/adapters/http/controllers/user-controller"
import { UserCrudUsecase } from "@/uses-cases/create-account.use-case"
import { PrismaUsersRepository } from "@/adapters/prisma-user-repository"

export class UserControllerFactory{

    public static getInstance():UserController {
        const repo = new PrismaUsersRepository()
        const userCase = new UserCrudUsecase(repo)
        const userController = new UserController(userCase)

        return userController
    }
}