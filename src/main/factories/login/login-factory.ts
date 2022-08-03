import env from '../../config/env'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import { AccountMongoRepository } from '../../../infra/db/mongodb/accout/account-mongo-repository'
import BcryptAdapter from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'

export const makeLoginController = (): Controller => {
    const salt = 12
    const accountMongoRepository = new AccountMongoRepository()
    const loginController = new LoginController(
        new DbAuthentication(
            accountMongoRepository,
            new BcryptAdapter(salt),
            new JwtAdapter(env.jwtSecret),
            accountMongoRepository
        ),
        makeLoginValidation()
    )

    return new LogControllerDecorator(loginController, new LogMongoRepository())
}
