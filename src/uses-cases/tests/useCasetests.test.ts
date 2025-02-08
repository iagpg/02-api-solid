import {describe, it,expect, vi} from 'vitest'
import { PartialUserUpdate, UserDomain } from '@/domain/user'
import { UserCrudUsecase } from '../create-account.use-case'
import { EmailAlreadyRegistered } from '@/core/exeptions/errors'

describe('Register Use Case', ()=>{
    
    const inMemoryRepo = {
        create: vi.fn(),
        update: vi.fn(),
        getById: vi.fn(),
        getByEmail: vi.fn(),
        delete: vi.fn(),
        getAll: vi.fn(),
    }

    const userCase = new UserCrudUsecase(inMemoryRepo)

    it('should update an user with all parameters', async()=>{
        const current_date = new Date()
        const user = new UserDomain(
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
            'iago',
            'iago123@gmail.com',
            '12345',
            false,
            current_date)

        inMemoryRepo.getByEmail.mockResolvedValue(existingUser)

        const newUser = new UserDomain(
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
            'iago',
            'iago123@gmail.com',
            '12345',
            false,
            current_date)

        inMemoryRepo.getByEmail.mockResolvedValue(expectedUser)
        await expect(userCase.getUser(userEmail)).resolves.toBeInstanceOf(UserDomain)
    })

    it('should delete an account',async ()=>{

    })
})