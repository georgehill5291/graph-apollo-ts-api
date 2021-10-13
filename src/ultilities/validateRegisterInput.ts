import { RegisterInput } from '../types/user/RegisterInput'

export const validateRegisterInput = (registerInput: RegisterInput) => {
    if (!registerInput.email.includes('@'))
        return {
            message: 'Invalid email',
            errors: [{ field: 'email', message: 'Email must included @ symbol' }],
        }

    if (registerInput.username.length <= 2)
        return {
            message: 'Invalid username',
            errors: [{ field: 'username', message: 'Username must be greater than 2' }],
        }

    if (registerInput.password.length <= 2)
        return {
            message: 'Invalid password',
            errors: [{ field: 'password', message: 'Password must be greater than 2' }],
        }

    return null
}
