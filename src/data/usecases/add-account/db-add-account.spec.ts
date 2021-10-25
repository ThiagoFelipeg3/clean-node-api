import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountReporitoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStup implements AddAccountRepository {
        async add (accountData: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'hashed_password'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountRepositoryStup()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountReporitoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountReporitoryStub)

    return {
        encrypterStub,
        sut,
        addAccountReporitoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)

        await expect(promise).rejects.toThrow()
    })

    test('Should call AddAccountReporitory with correnct values', async () => {
        const { sut, addAccountReporitoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountReporitoryStub, 'add')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        await sut.add(accountData)

        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'
        })
    })

    test('Should throw if AddAccount throws', async () => {
        const { sut, addAccountReporitoryStub } = makeSut()
        jest.spyOn(addAccountReporitoryStub, 'add').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)

        await expect(promise).rejects.toThrow()
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut()
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        const account = await sut.add(accountData)

        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'
        })
    })
})
