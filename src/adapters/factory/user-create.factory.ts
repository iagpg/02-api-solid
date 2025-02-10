import { UserController } from "@/adapters/http/controllers/user-controller"
import { UserCrudUsecase } from "@/uses-cases/create-account.use-case"
import { PrismaUsersRepository } from "@/adapters/prisma-user-repository"
import { authenticateCase } from "@/uses-cases/authenticate.use-case"
import { AuthenticateController } from "../http/controllers/authenticate-controller"

const repo = new PrismaUsersRepository()

export class UserControllerFactory {

    public static getInstance():UserController {
        const userCase = new UserCrudUsecase(repo)
        const userController = new UserController(userCase)
        return userController
    }
}

export class authenticateFactory {

    public static getInstance():AuthenticateController {
        const userCase = new authenticateCase(repo)
        const authenticateController = new AuthenticateController(userCase)
        return authenticateController
    }
}