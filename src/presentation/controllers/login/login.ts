import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Authentication } from '../../../domain/usercases/authentication'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
    constructor (
        private readonly emailValidator: EmailValidator,
        private readonly authentication: Authentication
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ['email', 'password']
            const { body: { email, password } } = httpRequest

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const emailValid = this.emailValidator.isValid(email)
            if (!emailValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const accessToken = await this.authentication.auth(email, password)
            if (!accessToken) {
                return unauthorized()
            }

            return ok({})
        } catch (error) {
            return serverError(error)
        }
    }
}
