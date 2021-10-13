import { AuthenticationError } from 'apollo-server-express'
import { MiddlewareFn } from 'type-graphql'
import { CustomContext } from '../types/shared/CustomContext'

export const CheckAuth: MiddlewareFn<CustomContext> = async ({ context: { req } }, next) => {
    if (!req.session.userId) {
        throw new AuthenticationError('Not authentication yet')
    }
    return next()
}

export const CheckAdminAuth: MiddlewareFn<CustomContext> = async ({ context: { req } }, next) => {
    if (!req.session.userId || !req.session.roles.includes('Admin')) {
        throw new AuthenticationError(
            'Not authentication yet || your role can not access this action'
        )
    }
    return next()
}
