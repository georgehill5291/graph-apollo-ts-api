import { Field, InputType, ObjectType } from 'type-graphql'
import { RelatedProductInput } from '../shared/RelatedProduct'

@InputType()
export class CreateCartInput {
    @Field()
    productId: string

    @Field()
    quantity: number
}

@InputType()
export class UpdateCartInput {
    @Field()
    cartId: string

    @Field()
    quantity: number
}
