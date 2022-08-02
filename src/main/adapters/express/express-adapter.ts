import { Request, Response } from 'express'
import {
    Controller,
    HttpRequest,
    HttpResponse
} from '../../../presentation/protocols'

export const adaptExpress = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpRequest: HttpRequest = {
            body: req.body
        }
        const httpResponse: HttpResponse = await controller.handle(httpRequest)
        const { statusCode, body } = httpResponse
        const response = statusCode > 299 ? { error: body.message } : body

        res.status(statusCode).json(response)
    }
}
