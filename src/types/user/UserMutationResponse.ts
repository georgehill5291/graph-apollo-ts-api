import { Field, ObjectType } from 'type-graphql'
import { User, UserModel } from '../../models/User'
import { FieldError } from '../shared/FieldError'
import { IMutationRepsponse } from '../shared/MutationResponse'

@ObjectType({ implements: IMutationRepsponse })
export class UserMutationResponse implements IMutationRepsponse {
    code: number
    success: boolean
    message?: string

    @Field({ nullable: true })
    user?: User

    @Field((_type) => [FieldError], { nullable: true })
    error?: FieldError[]
}
