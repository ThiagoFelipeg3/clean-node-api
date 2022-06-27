import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidationCompositeStub = (): Validation => {
    class ValidationCompositeStub implements Validation {
        validate (input: any): Error | null {
            return new MissingParamError('any_field')
        }
    }

    return new ValidationCompositeStub()
}

describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const validation = makeValidationCompositeStub()
        const sut = new ValidationComposite([validation])
        const response = sut.validate({ field: 'any_field' })

        expect(response).toEqual(new MissingParamError('any_field'))
    })
})
