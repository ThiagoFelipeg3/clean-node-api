import { AccountMongoRepository } from '../../infra/db/mongodb/accout-repository/account'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'

import { SignUpController } from '../../presentation/controllers/signup/signup'

import BcryptAdapter from '../../infra/criptography/bcrypt-adapter'
import EmailValidatorAdapter from '../../utils/email-validator-adapter'

export const makeSignupController = (): SignUpController => {
    const salt = 12

    return new SignUpController(
        new EmailValidatorAdapter(),
        new DbAddAccount(
            new BcryptAdapter(salt),
            new AccountMongoRepository()
        )
    )
}
