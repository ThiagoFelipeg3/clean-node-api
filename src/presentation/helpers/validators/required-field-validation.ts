import { MissingParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
    constructor (private readonly fieldName: string) {}

    validate (input: any): Error | null {
        return !input[this.fieldName] ? new MissingParamError(this.fieldName) : null
    }
}
