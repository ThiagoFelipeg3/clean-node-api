import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation('any_field', 'any_fieldToCompare')
}

describe('CampareField Validation', () => {
    test('Should return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const response = sut.validate({
            any_field: 'any_filed',
            any_fieldToCompare: 'wrong_filed'
        })

        expect(response).toEqual(new InvalidParamError('any_fieldToCompare'))
    })

    test('Should return null if validation succeeds', () => {
        const sut = makeSut()
        const response = sut.validate({
            any_field: 'any_filed',
            any_fieldToCompare: 'any_filed'
        })

        expect(response).toBeNull()
    })
})
