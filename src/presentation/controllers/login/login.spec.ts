import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest, Authentication } from './login-protocols'
import { LoginController } from './login'

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth (email: string, password: string): Promise<string> {
            return 'any_token'
        }
    }

    return new AuthenticationStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@mail.com',
        password: 'any_password'
    }
})

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const authenticationStub = makeAuthentication()
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(
        emailValidatorStub,
        authenticationStub
    )

    return {
        sut,
        emailValidatorStub,
        authenticationStub
    }
}

describe('Login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }

        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com'
            }
        }

        const response = await sut.handle(httpRequest)
        expect(response).toEqual(badRequest(new MissingParamError('password')))
    })

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        await sut.handle(makeFakeRequest())

        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const response = await sut.handle(makeFakeRequest())

        expect(response).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')

        await sut.handle(makeFakeRequest())

        expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
    })

    test('Should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(unauthorized())
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
})