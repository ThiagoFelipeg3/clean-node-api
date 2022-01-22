import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/model/account'
import { AddAccountModel } from '../../../../domain/usercases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const { insertedId: id } = await accountCollection.insertOne(accountData)
        const {
            _id,
            ...accountWhithouId
        } = await accountCollection.findOne({ _id: id }) as MongoFindAccount

        return { ...accountWhithouId, id: id.toHexString() }
    }
}

interface MongoFindAccount {
    _id: string
    name: string
    email: string
    password: string
}
