import { Field, ObjectType } from 'type-graphql'
import { Cart } from '../../models/Cart'
import { FieldError } from '../shared/FieldError'
import { IMutationRepsponse } from '../shared/MutationResponse'

@ObjectType({ implements: IMutationRepsponse })
export class CartMutationRespsone implements IMutationRepsponse {
    code: number
    success: boolean
    message?: string

    @Field({ nullable: true })
    cart?: Cart

    @Field((_type) => [FieldError], { nullable: true })
    error?: FieldError[]
}
