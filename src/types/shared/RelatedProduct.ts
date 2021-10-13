import mongoose from 'mongoose'
import { Field, ID, InputType, ObjectType } from 'type-graphql'

@InputType()
export class RelatedProductInput {
    @Field((_type) => ID)
    productId: { type: mongoose.Types.ObjectId; ref: 'ProductModel' }

    // @Field()
    // quantity: number
    // default: 1
}

@ObjectType()
export class RelatedProductObject {
    @Field((_type) => ID)
    _id: mongoose.Types.ObjectId
    @Field()
    title: string

    @Field()
    desc: string

    @Field()
    img: string

    @Field()
    price: number
}
