import { Validation } from '../../../presentation/protocols/validation'
import EmailValidatorAdapter from '../../../utils/email-validator-adapter'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../presentation/helpers/validators'

export const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    const fields = ['email', 'password']

    for (const field of fields) {
        validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    return new ValidationComposite(validations)
}
