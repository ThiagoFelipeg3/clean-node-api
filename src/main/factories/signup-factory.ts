import { AccountMongoRepository } from '../../infra/db/mongodb/accout-repository/account'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'

import { Controller } from '../../presentation/protocols'
import { SignUpController } from '../../presentation/controllers/signup/signup'

import BcryptAdapter from '../../infra/criptography/bcrypt-adapter'

import { LogControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { makeSignupValidation } from './signup-validation'

export const makeSignupController = (): Controller => {
    const salt = 12
    const signUpController = new SignUpController(
        new DbAddAccount(
            new BcryptAdapter(salt),
            new AccountMongoRepository()
        ),
        makeSignupValidation()
    )

    return new LogControllerDecorator(signUpController, new LogMongoRepository())
}
