import { Router } from 'express'
import { adaptExpress } from '../adapters/express/express-adapter'
import { makeSignupController } from '../factories/signup/signup-factory'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
    router.post('/signup', adaptExpress(makeSignupController()))
    router.post('/login', adaptExpress(makeLoginController()))
}
