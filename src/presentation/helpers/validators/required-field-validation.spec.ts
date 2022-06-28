import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('any_field')
}

describe('RequiredField Validation', () => {
    test('Should return a MissingParamError if validation fails', () => {
        const sut = makeSut()
        const response = sut.validate({ name: 'any_name' })

        expect(response).toEqual(new MissingParamError('any_field'))
    })

    test('Should return null if validation succeeds', () => {
        const sut = makeSut()
        const response = sut.validate({ any_field: 'any_name' })

        expect(response).toBeNull()
    })
})
