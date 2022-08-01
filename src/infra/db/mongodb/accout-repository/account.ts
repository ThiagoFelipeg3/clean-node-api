import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/model/account'
import { AddAccountModel } from '../../../../domain/usercases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const { insertedId: id } = await accountCollection.insertOne(accountData)
        const {
            _id,
            ...accountWithoutId
        } = await accountCollection.findOne({ _id: id }) as MongoFindAccount

        return { ...accountWithoutId, id: id.toHexString() }
    }

    async loadByEmail (email: string): Promise<AccountModel | null> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email }) as MongoFindAccount

        if (!account) {
            return null
        }

        const { _id, ...accountWithoutId } = account
        return { ...accountWithoutId, id: _id }
    }

    async updateAccessToken (id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.updateOne({ _id: new ObjectId(id) }, {
            $set: {
                accessToken: token
            }
        })
    }
}

export interface MongoFindAccount {
    _id: string
    name: string
    email: string
    password: string
}
