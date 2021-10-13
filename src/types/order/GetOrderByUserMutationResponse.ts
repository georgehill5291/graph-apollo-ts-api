import { Field, ObjectType } from 'type-graphql'
import { Cart } from '../../models/Cart'
import { Order } from '../../models/Order'
import { FieldError } from '../shared/FieldError'
import { IMutationRepsponse } from '../shared/MutationResponse'

@ObjectType({ implements: IMutationRepsponse })
export class GetOrderByUserMutationResponse implements IMutationRepsponse {
    code: number
    success: boolean
    message?: string

    @Field((_type) => [Order], { nullable: true })
    orders?: Order[]

    @Field({ nullable: true })
    total?: number

    @Field((_type) => [FieldError], { nullable: true })
    error?: FieldError[]
}
