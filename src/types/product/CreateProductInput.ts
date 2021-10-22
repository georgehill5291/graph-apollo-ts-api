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

    @Field((_return) => [String])
    size: string[]

    @Field((_return) => [String])
    color: string[]

    @Field((_return) => [String])
    categories: string[]
}
