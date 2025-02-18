import {describe, it,expect, vi} from 'vitest'
import { AuthenticateResponse, CheckIn, CheckInResponse, Gym, PartialUserUpdate, UserDomain } from '@/domain/user'
import { UserCrudUsecase } from '../create-account.use-case'
import { authenticateCase } from '../authenticate.use-case'
import { hash } from 'bcrypt'
import { randomUUID } from 'node:crypto'
import { CheckInUseCase } from '../check-in.use-case'
import { beforeEach } from 'node:test'
import { CheckInAlreadyExist, CheckInTwiceSameDay, EmailAlreadyRegistered, invalidCredentialsError, ResourceNotFound, UserNotInRange } from '@/core/exeptions/errors'

const mockuserRepo = {
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
    getByEmail: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(),
    get: vi.fn(),
    getByDate:vi.fn()
}

const mockGymRepository = {
    create: vi.fn(),
    get: vi.fn(),
}
const authenticateUseCase = new authenticateCase(mockuserRepo)
const userCase = new UserCrudUsecase(mockuserRepo)
//const gymCase = new GymUseCase(mockGymRepository)

const checkInUseCase = new CheckInUseCase(mockuserRepo,mockGymRepository)
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

        mockuserRepo.getById.mockResolvedValue(user)
        const expectedId = "1"
        const partialUser = new PartialUserUpdate(expectedId, "yolo", false)
        await userCase.updateUser(partialUser)

        expect(mockuserRepo.update).toHaveBeenCalledWith(expectedId, expect.objectContaining({
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

        mockuserRepo.getById.mockResolvedValue(user)

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

        expect(mockuserRepo.update).toHaveBeenCalledWith(expectedId, expected)

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

        mockuserRepo.getByEmail.mockResolvedValue(existingUser)

        const newUser = new UserDomain(
            'id',
            'johnDoe',
            'iago123@gmail.com',
            '22334',
            false,
            current_date)
       
        await expect(userCase.createAccount(newUser)).rejects.toThrow(EmailAlreadyRegistered)
        expect(mockuserRepo.create).not.toHaveBeenCalled()
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
            
        mockuserRepo.getByEmail.mockResolvedValue(undefined) // usuário nao existe
        mockuserRepo.create.mockResolvedValue(newAccount)

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

        mockuserRepo.getById.mockResolvedValue(expectedUser)
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

        mockuserRepo.getByEmail.mockResolvedValue(expectedUser)
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
            
        mockuserRepo.getByEmail.mockResolvedValue(userFound)
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

        mockuserRepo.getByEmail.mockResolvedValue(userFound)
        const response = await authenticateUseCase.authenticate({ email, password: correctPassword })

        expect(response).toBeInstanceOf(AuthenticateResponse)
        expect(response).toMatchObject({ id: 'id' } as AuthenticateResponse)
    })
})

describe('Check in Use Case', ()=>{

    const gym = new Gym({
        id: randomUUID(),
        title: 'test gym',
        description:'',
        phone:'',
        latitude:-23.960269,
        longitude:-46.3732736,
    })

    beforeEach(()=>{
        vi.useFakeTimers()
    })
    it('should create check in', async ()=>{
        const user_id = randomUUID()
        const gym_id = randomUUID()
        const date =  new Date()
        const createdCheckIn = new CheckIn(
            randomUUID(),
            date,
            user_id,
            gym_id
        )

        vi.spyOn(checkInUseCase, 'validateCheckInCreation').mockResolvedValue(undefined)

        mockuserRepo.get.mockResolvedValue(undefined)
        mockuserRepo.create.mockResolvedValue(createdCheckIn)
       
        await expect(checkInUseCase.CreateCheckIn({userId:user_id,gymId:gym_id,date})).resolves.toBeInstanceOf(CheckInResponse)
        
    })

    it('should not create an existent check in', async ()=>{
        const user_id = randomUUID()
        const date = new Date(2025, 2, 22, 8, 0, 0)
        vi.setSystemTime(date)

        vi.spyOn(checkInUseCase,'validateCheckInCreation').mockRejectedValue(new CheckInAlreadyExist())

        await expect(checkInUseCase.CreateCheckIn({
            userId:user_id,
            gymId:gym.id,
            date
        }
        )).rejects.toBeInstanceOf(CheckInAlreadyExist)
        vi.useRealTimers()
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

        mockuserRepo.getByDate.mockResolvedValue(userCheckIn)
        mockGymRepository.get.mockResolvedValue(gym)

        const spy = vi.spyOn(mockuserRepo, "update")

        const result = await checkInUseCase.validateCheckIn(userCheckIn.user_id, date,{
            latitude: -23.960269, longitude:-46.3732736
        })
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
        
        mockuserRepo.getByDate.mockResolvedValue(userCheckIn)
        mockGymRepository.get.mockResolvedValue(gym)

        const spy = vi.spyOn(mockuserRepo,'update')
        await expect(checkInUseCase.validateCheckIn(userCheckIn.id ,date,{
            latitude: -23.960269, longitude:-46.3732736
        })).rejects.toThrow(CheckInTwiceSameDay)
        expect(spy).not.toHaveBeenCalledWith(userCheckIn.user_id, date)
        vi.useRealTimers()
    })

    it('should verify if a user is inside of 100m of a gym ', async ()=>{

        const user_id = randomUUID()
        const date = new Date(2025, 2, 14, 8, 0, 0)

        const userCheckIn = new CheckIn(
            randomUUID(),
            new Date(),
            user_id,
            gym.id,
            undefined
        )

        mockuserRepo.getByDate.mockResolvedValue(userCheckIn)

        mockGymRepository.get.mockResolvedValue(gym)

        const spy = vi.spyOn(mockuserRepo,'update')
        const result = await checkInUseCase.validateCheckIn(user_id,date,
            {
                latitude: -23.960369, longitude:-46.3732836
            })
        expect(result).toBeUndefined()
        expect(spy).toHaveBeenCalledWith(userCheckIn.user_id, date)
    })

    it('should verify if a user is outside of 100m of a gym ', async ()=>{

        const user_id = randomUUID()
        const date = new Date(2025, 2, 14, 8, 0, 0)

        const userCheckIn = new CheckIn(
            randomUUID(),
            new Date(),
            user_id,
            gym.id,
            undefined // undefined otherwise will give "check in" twice error
        )

        mockuserRepo.getByDate.mockResolvedValue(userCheckIn)
        mockGymRepository.get.mockResolvedValue(gym)
  
        //  const spy = vi.spyOn(mockuserRepo,'update')'
        await expect(checkInUseCase.validateCheckIn(user_id, date, {
            latitude: -23.9578767, longitude: -46.3431117
        })).rejects.toThrow(UserNotInRange)
    })
    it('it should error when trying to get a non existent check-in', async ()=>{
        const user_id = randomUUID()
        const date = new Date(2025, 2, 14, 8, 0, 0)

        mockuserRepo.getByDate.mockRejectedValue(new ResourceNotFound())
        mockGymRepository.get.mockResolvedValue(gym)
        
        await expect(checkInUseCase.validateCheckIn(user_id, date, {
            latitude: -23.9578767, longitude: -46.3431117
        })).rejects.toThrow(ResourceNotFound)
    })
})