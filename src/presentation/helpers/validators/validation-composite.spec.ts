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
    validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
    const validationStubs = [makeValidationCompositeStub(), makeValidationCompositeStub()]
    const sut = new ValidationComposite(validationStubs)

    return {
        sut,
        validationStubs
    }
}

describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const response = sut.validate({ field: 'any_field' })

        expect(response).toEqual(new MissingParamError('any_field'))
    })

    test('Should return the first error if more then one validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const response = sut.validate({ field: 'any_field' })

        expect(response).toEqual(new Error())
    })
})
