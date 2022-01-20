import { Router } from 'express'

export default (router: Router): void => {
    router.get('/presentation', (req, res) => {
        res.json({
            status: 'initial',
            presentations: 'Welcome to the clean node api system !!'
        })
    })
}
