import { AccountMongoRepository } from '../../infra/db/mongodb/accout-repository/account'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'

import { Controller } from '../../presentation/protocols'
import { SignUpController } from '../../presentation/controllers/signup/signup'

import BcryptAdapter from '../../infra/criptography/bcrypt-adapter'
import EmailValidatorAdapter from '../../utils/email-validator-adapter'

import { LogControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'

export const makeSignupController = (): Controller => {
    const salt = 12
    const signUpController = new SignUpController(
        new EmailValidatorAdapter(),
        new DbAddAccount(
            new BcryptAdapter(salt),
            new AccountMongoRepository()
        )
    )

    return new LogControllerDecorator(signUpController, new LogMongoRepository())
}
