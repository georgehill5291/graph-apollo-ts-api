import { Field, ObjectType } from 'type-graphql'
import { Cart } from '../../models/Cart'
import { FieldError } from '../shared/FieldError'
import { IMutationRepsponse } from '../shared/MutationResponse'

@ObjectType({ implements: IMutationRepsponse })
export class GetCardByUserMutationResponse implements IMutationRepsponse {
    code: number
    success: boolean
    message?: string

    @Field((_type) => [Cart], { nullable: true })
    carts?: Cart[]

    @Field({ nullable: true })
    total?: number

    @Field((_type) => [FieldError], { nullable: true })
    error?: FieldError[]
}
