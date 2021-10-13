import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateProductInput {
    @Field()
    title: string

    @Field()
    desc: string

    @Field()
    img: string

    @Field()
    price: string
}
