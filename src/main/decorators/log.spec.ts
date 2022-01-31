import { LogErrorRespository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 201,
                body: {}
            }

            return new Promise(resolve => resolve(httpResponse))
        }
    }

    return new ControllerStub()
}

const makeLogErrorRespository = (): LogErrorRespository => {
    class LogErrorRespositoryStub implements LogErrorRespository {
        async log (stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new LogErrorRespositoryStub()
}

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRespository
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRespository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

describe('LogController Decorator', () => {
    test('Should call controller handle', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConformation: 'any_password'
            }
        }

        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Should return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConformation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual({
            statusCode: 201,
            body: {}
        })
    })

    test('Should call LogErrorRespository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'

        const error = serverError(fakeError)
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))

        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConformation: 'any_password'
            }
        }

        await sut.handle(httpRequest)

        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
