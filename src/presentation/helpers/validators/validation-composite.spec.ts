import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidationCompositeStub = (): Validation => {
    class ValidationCompositeStub implements Validation {
        validate (input: any): Error | null {
            return null
        }
    }

    return new ValidationCompositeStub()
}

interface SutTypes {
    sut: ValidationComposite
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidationCompositeStub()
    const sut = new ValidationComposite([validationStub])

    return {
        sut,
        validationStub
    }
}

describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const response = sut.validate({ field: 'any_field' })

        expect(response).toEqual(new MissingParamError('any_field'))
    })
})
