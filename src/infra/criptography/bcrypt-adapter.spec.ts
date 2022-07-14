import bcrypt from 'bcrypt'
import BcryptAdapter from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return Promise.resolve('hash_value')
    },

    async compare (): Promise<boolean> {
        return Promise.resolve(true)
    }
}))

interface SutTypes {
    salt: number
    sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    return {
        salt,
        sut
    }
}

describe('Bcrypt Adapter', () => {
    test('Should call hash with correct values', async () => {
        const { salt, sut } = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')

        await sut.hash('any_value')

        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
        const { sut } = makeSut()
        const hash = await sut.hash('any_value')

        expect(hash).toBe('hash_value')
    })

    test('Should throw if bcrypt throws', async () => {
        const { sut } = makeSut()

        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(
            () => {
                throw new Error()
            }
        )

        const promise = sut.hash('any_value')

        await expect(promise).rejects.toThrow()
    })

    test('Should call compare with correct values', async () => {
        const { sut } = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')

        await sut.compare('any_value', 'any_hash')

        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
        const { sut } = makeSut()
        const isValid = await sut.compare('any_value', 'any_hash')

        expect(isValid).toBe(true)
    })

    test('Should return true when compare succeeds', async () => {
        const { sut } = makeSut()
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => Promise.resolve(false))
        const isValid = await sut.compare('any_value', 'any_hash')

        expect(isValid).toBe(false)
    })
})
