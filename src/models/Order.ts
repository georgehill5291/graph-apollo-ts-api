import { prop, getModelForClass, modelOptions, Severity, plugin } from '@typegoose/typegoose'
import mongoose, { Schema } from 'mongoose'
import { Field, ID, ObjectType } from 'type-graphql'
import { RelatedProductObject } from '../types/shared/RelatedProduct'
import { ProductModel } from './Product'

@ObjectType()
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Order {
    @Field((_type) => ID)
    _id: Schema.Types.ObjectId

    @prop({ required: true })
    @Field()
    userId: string

    @Field((_type) => [RelatedProductObject])
    @prop()
    products: [Schema.Types.ObjectId]

    @Field()
    @prop()
    total: number

    @Field()
    @prop({ default: Date.now })
    createdAt: Date

    @Field()
    updatedAt: Date
}

export const OrderModel = getModelForClass(Order)
