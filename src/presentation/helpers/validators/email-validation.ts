import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from './validation'

export class EmailValidation implements Validation {
    constructor (
        private readonly fieldName: string,
        private readonly emailValidator: EmailValidator
    ) {}

    validate (input: any): Error | null {
        return !this.emailValidator.isValid(input[this.fieldName])
            ? new InvalidParamError(this.fieldName)
            : null
    }
}
