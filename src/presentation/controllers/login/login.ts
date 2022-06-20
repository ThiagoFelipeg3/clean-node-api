import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
    constructor (private readonly emailValidator: EmailValidator) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const { body: { email, password } } = httpRequest

        if (!email) {
            return badRequest(new MissingParamError('email'))
        }

        if (!password) {
            return badRequest(new MissingParamError('password'))
        }

        const emailValid = this.emailValidator.isValid(email)
        if (!emailValid) {
            return badRequest(new InvalidParamError('email'))
        }

        return ok({})
    }
}
