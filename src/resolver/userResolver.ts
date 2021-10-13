import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { User, UserModel } from '../models/User'
import argon2 from 'argon2'
import { RegisterInput } from '../types/user/RegisterInput'
import { validateRegisterInput } from '../ultilities/validateRegisterInput'
import { UserMutationResponse } from '../types/user/UserMutationResponse'
import { CustomContext } from '../types/shared/CustomContext'
import { LoginInput } from '../types/user/LoginInput'
import { COOKIE_NAME } from '../ultilities/constant'
import mongoose from 'mongoose'

@Resolver((_of) => UserModel)
export class UserResolver {
    @Mutation((_return) => UserMutationResponse, { nullable: true })
    async register(
        @Arg('registerInput') registerInput: RegisterInput
        // @Ctx() { req }: CustomContext
    ): Promise<UserMutationResponse | null> {
        const validationInput = validateRegisterInput(registerInput)

        if (validationInput !== null) {
            return {
                code: 400,
                success: false,
                ...validationInput,
            }
        }

        try {
            const { username, email, password } = registerInput
            const existingUser = await UserModel.findOne({
                $or: [
                    {
                        username: username,
                    },
                    {
                        email: email,
                    },
                ],
            })

            if (existingUser)
                return {
                    code: 400,
                    success: false,
                    message: 'Duplicated username or email',
                    error: [
                        {
                            field: existingUser.username === username ? 'username' : 'Email',
                            message: `${
                                existingUser.username === username ? 'Username' : 'Email'
                            } already taken`,
                        },
                    ],
                }

            const hashedPassword = await argon2.hash(password)
            let newUser = new UserModel({
                username,
                password: hashedPassword,
                email,
            })

            newUser = await newUser.save()

            //session: store user
            // req.session.userId = newUser.id;

            return {
                code: 200,
                success: true,
                message: 'register success',
                user: newUser,
            }
        } catch (error) {
            console.log(error)
            return {
                code: 500,
                success: true,
                message: 'Internal error',
            }
        }
    }

    @Mutation((_return) => UserMutationResponse)
    async login(
        @Arg('loginInput') loginInput: LoginInput,
        @Ctx() { req }: CustomContext
    ): Promise<UserMutationResponse> {
        try {
            const existingUser = await UserModel.findOne(
                loginInput.usernameOrEmail.includes('@')
                    ? { email: loginInput.usernameOrEmail }
                    : { username: loginInput.usernameOrEmail }
            )

            if (!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'User not found',
                    error: [
                        {
                            field: 'usernameOrEmail',
                            message: 'username or password incorrect',
                        },
                    ],
                }
            }

            const passwordValid = await argon2.verify(existingUser.password, loginInput.password)
            if (!passwordValid) {
                return {
                    code: 400,
                    success: false,
                    message: 'Wrong password',
                    error: [
                        {
                            field: 'usernameOrEmail',
                            message: 'username or password incorrect',
                        },
                    ],
                }
            }

            //session: create and return cookie
            req.session.userId = existingUser.id
            req.session.roles = existingUser.roles

            return { code: 200, success: true, message: 'Login success', user: existingUser }
        } catch (error) {
            console.log(error)
            return {
                code: 500,
                success: true,
                message: 'Internal error',
                error: [
                    {
                        field: 'usernameOrEmail',
                        message: 'username or password incorrect',
                    },
                ],
            }
        }
    }

    @Mutation((_return) => Boolean)
    logout(@Ctx() { req, res }: CustomContext): Promise<boolean> {
        return new Promise((resolve, _reject) => {
            console.log('session.userId', req.session.userId)
            res.clearCookie(COOKIE_NAME)

            req.session.destroy((error) => {
                if (error) {
                    console.log('DESTROY SESSION ERROR', error)
                    resolve(false)
                }
                resolve(true)
            })
        })
    }

    @Query((_return) => User, { nullable: true })
    async me(@Ctx() { req }: CustomContext): Promise<User | undefined | null> {
        if (!req.session.userId) return null

        const user = await UserModel.findOne({ _id: req.session.userId })
        return user
    }
}
