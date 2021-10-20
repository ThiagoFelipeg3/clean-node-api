import { AccountModel } from '../../../domain/model/account'
import { AddAccount, AddAccountModel } from '../../../domain/usercases/add-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
    constructor (private readonly encrypter: Encrypter) { }

    async add (account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password)

        return new Promise(resolve => resolve({
            id: 'string',
            name: 'string',
            email: 'string',
            password: 'string'
        }))
    }
}


