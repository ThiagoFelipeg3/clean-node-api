import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

interface SutTypes {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new EmailValidation('email', emailValidatorStub)

    return {
        sut,
        emailValidatorStub
    }
}

describe('Email Validation', () => {
    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const field = { email: 'any_email@mail.com' }

        sut.validate(field)

        expect(isValidSpy).toHaveBeenCalledWith(field.email)
    })

    test('Should throw if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        expect(sut.validate).toThrow()
    })

    test('Should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const response = sut.validate({ email: 'any_email@mail.com' })

        expect(response).toEqual(new InvalidParamError('email'))
    })
})