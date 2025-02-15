import {describe, it,expect, vi} from 'vitest'
import { AuthenticateResponse, CheckIn, CheckInResponse, PartialUserUpdate, UserDomain } from '@/domain/user'
import { UserCrudUsecase } from '../create-account.use-case'
import { authenticateCase } from '../authenticate.use-case'
import { hash } from 'bcrypt'
import { randomUUID } from 'node:crypto'
import { CheckInUseCase } from '../check-in.use-case'
import { beforeEach } from 'node:test'
import { CheckInAlreadyExist, CheckInTwiceSameDay, EmailAlreadyRegistered, invalidCredentialsError } from '@/core/exeptions/errors'

const inMemoryRepo = {
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
    getByEmail: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(),
    get: vi.fn(),
}
const authenticateUseCase = new authenticateCase(inMemoryRepo)
const userCase = new UserCrudUsecase(inMemoryRepo)
const checkInUseCase = new CheckInUseCase(inMemoryRepo)
describe('Register Use Case', ()=>{
    
    it('should update an user with all parameters', async()=>{
        const current_date = new Date()
        const user = new UserDomain(
            'id',
            'iago',
            'iago222122@gmail.com',
            '12345',
            true,
            current_date)

        inMemoryRepo.getById.mockResolvedValue(user)
        const expectedId = "1"
        const partialUser = new PartialUserUpdate(expectedId, "yolo", false)
        await userCase.updateUser(partialUser)

        expect(inMemoryRepo.update).toHaveBeenCalledWith(expectedId, expect.objectContaining({
            name: "yolo",
            email: "iago222122@gmail.com",
            password: "12345",
            active: false,
            created_at: current_date
        }))
    
    })

    it('should update only the name of the user',async ()=>{

        const current_date = new Date()
        const user = new UserDomain(
            'id',
            'iago',
            'iago222122@gmail.com',
            '12345',
            false,
            current_date)

        inMemoryRepo.getById.mockResolvedValue(user)

        const expectedId = "1"
        const userUpdated = new PartialUserUpdate(expectedId, "johnDoe")
        await userCase.updateUser(userUpdated)

        const expected = new UserDomain(
            'id',
            'johnDoe',
            'iago222122@gmail.com',
            '12345',
            false,
            current_date)

        expect(inMemoryRepo.update).toHaveBeenCalledWith(expectedId, expected)

    })

    it('should not permit duplicated email', async ()=>{

        const current_date = new Date()
        const existingUser = new UserDomain(
            'id',
            'iago',
            'iago123@gmail.com',
            '12345',
            false,
            current_date)

        inMemoryRepo.getByEmail.mockResolvedValue(existingUser)

        const newUser = new UserDomain(
            'id',
            'johnDoe',
            'iago123@gmail.com',
            '22334',
            false,
            current_date)
       
        await expect(userCase.createAccount(newUser)).rejects.toThrow(EmailAlreadyRegistered)
        expect(inMemoryRepo.create).not.toHaveBeenCalled()
    })

    it("should create an account",async ()=>{
        
        const current_date = new Date()
        const newAccount = new UserDomain(
            'iasdasd',
            'iago',
            'iago123@gmail.com',
            '12345',
            false,
            current_date)
            
        inMemoryRepo.getByEmail.mockResolvedValue(undefined) // usuário nao existe
        inMemoryRepo.create.mockResolvedValue(newAccount)

        await expect(userCase.createAccount(newAccount)).resolves.toBeInstanceOf(UserDomain)
    })

    it('should get information of an account by id', async ()=>{
        const userId = '1'

        const current_date = new Date()
        const expectedUser = new UserDomain(
            'asdasdasd',
            'iago',
            'iago123@gmail.com',
            '12345',
            false,
            current_date)

        inMemoryRepo.getById.mockResolvedValue(expectedUser)
        await expect(userCase.getUser(userId)).resolves.toBeInstanceOf(UserDomain)
    })

    it('should get information of an account by email', async ()=>{
        const userEmail = 'yolo@yolo.com'

        const current_date = new Date()
        const expectedUser = new UserDomain(
            'asdasd',
            'iago',
            'iago123@gmail.com',
            '12345',
            false,
            current_date)

        inMemoryRepo.getByEmail.mockResolvedValue(expectedUser)
        await expect(userCase.getUser(userEmail)).resolves.toBeInstanceOf(UserDomain)
    })

})

describe('authentication Use Case', () => {

    it('should give an error of authorization', async ()=>{
        const email = 'iago@gmail.com'
        const incorretPassword = '123456789'
        const correctPassword = '123456'
        const current_date = new Date()

        const hashedPassword = await hash(correctPassword,6)
        const userFound = new UserDomain(
            'id',
            'name',
            'iago@gmail.com',
            hashedPassword,
            false,
            current_date)
            
        inMemoryRepo.getByEmail.mockResolvedValue(userFound)
        await expect(authenticateUseCase.authenticate({email, password:incorretPassword})).rejects.toThrow(invalidCredentialsError)
    })

    it('should authenticate successfully', async ()=>{
        const email = 'iago@gmail.com'
        const correctPassword = '123456'
        const current_date = new Date()

        const hashedPassword = await hash(correctPassword,6)
        const userFound = new UserDomain(
            'id',
            'name',
            'iago@gmail.com',
            hashedPassword,
            false,
            current_date)

        inMemoryRepo.getByEmail.mockResolvedValue(userFound)
        const response = await authenticateUseCase.authenticate({ email, password: correctPassword })

        expect(response).toBeInstanceOf(AuthenticateResponse)
        expect(response).toMatchObject({ id: 'id' } as AuthenticateResponse)
    })
})

describe('Check in Use Case', ()=>{

    beforeEach(()=>{ vi.useFakeTimers()})
    it('should create check in', async ()=>{
        const user_id = randomUUID()
        const gym_id = randomUUID()

        const createdCheckIn = new CheckIn(
            randomUUID(),
            new Date(),
            user_id,
            gym_id
        )
        inMemoryRepo.get.mockResolvedValue(undefined)
        inMemoryRepo.create.mockResolvedValue(createdCheckIn)
       
        await expect(checkInUseCase.CreateCheckIn({userId:user_id,gymId:gym_id})).resolves.toBeInstanceOf(CheckInResponse)
        
    })

    it('should check if a check in exist', async ()=>{
        const user_id = randomUUID()
        const gym_id = randomUUID()

        const existentCheckIn = new CheckIn(
            randomUUID(),
            new Date(),
            user_id,
            gym_id
        )

        inMemoryRepo.get.mockResolvedValue(existentCheckIn)
        inMemoryRepo.create.mockResolvedValue(CheckInAlreadyExist)
        
        await expect(checkInUseCase.CreateCheckIn({
            userId:user_id,
            gymId:gym_id
        }
        )).rejects.toBeInstanceOf(CheckInAlreadyExist)
        
    })

    it("Should validate user's check in", async ()=>{
        const user_id = randomUUID()
        const gym_id = randomUUID() 

        const date = new Date(2025, 2, 22, 8, 0, 0)
        vi.setSystemTime(date)
        
        const userCheckIn = new CheckIn(
            randomUUID(),
            new Date(),
            user_id,
            gym_id,
            new Date(2025,2,23,16,0,0)
        )
        console.log(userCheckIn.created_at)

        inMemoryRepo.get.mockResolvedValue(userCheckIn)
        const spy = vi.spyOn(inMemoryRepo, "update")

        const result = await checkInUseCase.validateCheckIn(userCheckIn.user_id, date)
        expect(result).toBeUndefined() // void
        expect(spy).toHaveBeenCalledWith(userCheckIn.user_id, date)
        vi.useRealTimers()

    })

    it("Should not validated user's check in twice", async ()=>{
        const user_id = randomUUID()
        const gym_id = randomUUID() 

        const date = new Date(2025, 2, 14, 8, 0, 0)
        
        const userCheckIn = new CheckIn(
            randomUUID(),
            new Date(),
            user_id,
            gym_id,
            date
        )
        
        vi.setSystemTime(date)
        
        inMemoryRepo.get.mockResolvedValue(userCheckIn)
        const spy = vi.spyOn(inMemoryRepo,'update')
        await expect(checkInUseCase.validateCheckIn(userCheckIn.id ,date)).rejects.toThrow(CheckInTwiceSameDay)
        expect(spy).not.toHaveBeenCalledWith(userCheckIn.user_id, date)
        vi.useRealTimers()
    })
})