import { Request, Response, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const contentType = (req: Request, res: Response, next: NextFunction) => {
    res.set('Content-Type', 'application/json')

    next()
}
