/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
    port: process.env.PORT || 5050,
    jwtSecret: process.env.JWT_SECRET || 'sad58e5s4da==s5*s65'
}
