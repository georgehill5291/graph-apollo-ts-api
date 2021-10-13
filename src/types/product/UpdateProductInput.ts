import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class UpdateProductInput {
    @Field((_type) => ID)
    id: string

    @Field()
    title: string

    @Field()
    desc: string

    @Field()
    img: string

    @Field()
    price: number
}
