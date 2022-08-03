import { AccountMongoRepository } from '../../../infra/db/mongodb/accout/account-mongo-repository'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'

import { Controller } from '../../../presentation/protocols'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'

import BcryptAdapter from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'

import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { makeSignupValidation } from './signup-validation-factory'

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
