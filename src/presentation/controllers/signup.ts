import { Controller } from '../protocols/controller'

import { HttpRequest, HttpResponse } from '../protocols/http'
import { EmailValidator } from '../protocols/email-validator'

import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'

export class SignUpController implements Controller {
    constructor (private readonly emailValidator: EmailValidator) {}

    handle (httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const isValid = this.emailValidator.isValid(httpRequest.body.email)

            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            return {
                body: {},
                statusCode: 200
            }
        } catch (error) {
            return serverError()
        }
    }
}
