import { Field, InputType } from 'type-graphql'

@InputType()
export class StripeInput {
    @Field()
    tokenId: string

    @Field()
    amount: string
}
