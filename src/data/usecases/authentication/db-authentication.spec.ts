import { AccountModel } from '../../../domain/model/account'
import { AuthenticationModel } from '../../../domain/usercases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
})

const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare (value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }

    return new HashComparerStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load (email: string): Promise<AccountModel | null> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
    sut: DbAuthentication
    HashComparerStub: HashComparer
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const HashComparerStub = makeHashComparer()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, HashComparerStub)

    return {
        sut,
        HashComparerStub,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

        await sut.auth(makeFakeAuthentication())

        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.auth(makeFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const accessToken = await sut.auth(makeFakeAuthentication())

        expect(accessToken).toBeNull()
    })

    test('Should call HashComparer with correct values', async () => {
        const { sut, HashComparerStub } = makeSut()
        const hashSpy = jest.spyOn(HashComparerStub, 'compare')

        await sut.auth(makeFakeAuthentication())

        expect(hashSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    test('Should throw if HashComparer throws', async () => {
        const { sut, HashComparerStub } = makeSut()
        jest.spyOn(HashComparerStub, 'compare').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.auth(makeFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })
})
