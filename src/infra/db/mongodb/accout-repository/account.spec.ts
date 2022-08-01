import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    test('Should return an account on add success', async () => {
        const sut = makeSut()
        const account = await sut.add({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        })

        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_email@mail.com')
        expect(account.password).toBe('any_password')
    })

    test('Should return an account on loadByEmail success', async () => {
        const sut = makeSut()
        await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        })
        const account = await sut.loadByEmail('any_email@mail.com')

        if (account) {
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@mail.com')
            expect(account.password).toBe('any_password')
        }
    })

    test('Should return null if loadByEmail fails', async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail('anny_email@mail.com')

        expect(account).toBeNull()
    })

    test('Should update the account accessToken on updateAccessToen success', async () => {
        const sut = makeSut()
        const { insertedId: id } = await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        })
        const account = await accountCollection.findOne({ _id: id })
        if (!account) {
            return
        }

        expect(account.accessToken).toBeFalsy()

        await sut.updateAccessToken(account._id.toHexString(), 'any_token')

        const accountFind = await accountCollection.findOne({ _id: account._id })
        if (!accountFind) {
            return
        }

        expect(accountFind).toBeTruthy()
        expect(accountFind.accessToken).toBe('any_token')
        expect(accountFind.name).toBe('any_name')
    })
})
