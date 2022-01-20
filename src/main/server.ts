import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl).then(async () => {
    /**
     * O import aqui dentro garante que não seja utilizado nem um modulo
     * que dependa do banco de dados, antes que o mesmo estaja conectado.
     */
    const app = (await import('./config/app')).default

    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
}).catch(console.error)
