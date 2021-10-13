import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import session from 'express-session'
import { buildSchema } from 'type-graphql'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import { HelloResolver } from './resolver/hello'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { UserResolver } from './resolver/userResolver'
import { buildDataLoaders } from './ultilities/dataLoader'
import { CustomContext } from './types/shared/CustomContext'
import { COOKIE_NAME, __prod__ } from './ultilities/constant'
import { ProductResolver } from './resolver/productResolver'
import { CartResolver } from './resolver/cartResolver'
import cors from 'cors'
import { StripeResolver } from './resolver/stripeResolver'
import { OrderResolver } from './resolver/orderResolver'
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core/dist/plugin/landingPage/default'

const dotenv = require('dotenv').config()

const main = async () => {
    const app = express()
    const PORT = process.env.PORT || 4000

    app.set('trust proxy', 1)

    app.use(
        cors({
            origin: __prod__ ? process.env.CORS_ORIGIN_PROD : process.env.CORS_ORIGIN_DEV,
            credentials: true,
        })
    )

    const mongoUrl = process.env.MONGODB
    await mongoose.connect(mongoUrl, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    console.log('MongoDB connected')

    app.use(
        session({
            name: COOKIE_NAME,
            store: new MongoStore({ mongoUrl }),
            cookie: {
                maxAge: 1000 * 60 * 60, //on hour
                httpOnly: true, // JS from frontend can not access
                secure: __prod__, // cookie only work in https
                sameSite: 'lax', // protection agaist CSRF //none if difference domain
            },
            secret: process.env.SESSION_SECRET_DEV_PROD as string,
            saveUninitialized: false, //dont' save empty session, when start
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                HelloResolver,
                UserResolver,
                ProductResolver,
                CartResolver,
                StripeResolver,
                OrderResolver,
            ],
            validate: false,
        }),
        context: ({ req, res }): CustomContext => ({
            req,
            res,
            // connection,
            dataLoaders: buildDataLoaders(),
        }),
        // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        plugins:
            process.env.ENV_IS_PROD === 'production'
                ? [ApolloServerPluginLandingPageProductionDefault({ footer: false })]
                : [ApolloServerPluginLandingPageGraphQLPlayground],
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({ app, cors: false })

    app.get('/', (req, res) => {
        res.send('Hello George')
    })

    app.listen(PORT, () => {
        return console.log(`server is listening on ${PORT}`)
    })
}

main().catch((error) => console.log(error))
