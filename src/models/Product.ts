import { prop, getModelForClass, modelOptions, Severity, plugin } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { Field, ID, ObjectType } from 'type-graphql'
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose-paginate-v2'
const mongoosePaginate = require('mongoose-paginate-v2')

@ObjectType()
@plugin(mongoosePaginate)
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Product {
    @Field((_type) => ID)
    _id: mongoose.Types.ObjectId

    @prop({ required: true })
    @Field()
    title: string

    @Field()
    @prop({ required: true })
    desc: string

    @Field()
    @prop({ required: true })
    img: string

    @Field((_type) => [String])
    @prop()
    categories: Array<string>

    @Field((_type) => [String])
    @prop()
    size: Array<string>

    @Field((_type) => [String])
    @prop()
    color: Array<string>

    @Field()
    @prop()
    price: number

    @Field()
    @prop({ default: Date.now })
    createdAt: Date

    @Field()
    @prop({ default: Date.now })
    updatedAt: Date

    static paginate: PaginateMethod<Product>
}

type PaginateMethod<T> = (
    query?: FilterQuery<T>,
    options?: PaginateOptions,
    callback?: (err: any, result: PaginateResult<T>) => void
) => Promise<PaginateResult<T>>

export const ProductModel = getModelForClass(Product)
