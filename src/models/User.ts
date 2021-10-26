import { prop, getModelForClass, modelOptions, Severity, plugin } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { Field, ID, ObjectType } from 'type-graphql'
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose-paginate-v2'
const mongoosePaginate = require('mongoose-paginate-v2')

@ObjectType()
@plugin(mongoosePaginate)
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class User {
    @Field((_type) => ID)
    _id: mongoose.Types.ObjectId

    @Field()
    @prop({ required: true })
    username: string

    @Field()
    @prop({ required: true })
    email: string

    @Field()
    @prop({ required: true })
    password: string

    @Field((_type) => [String])
    @prop({ default: ['User'] })
    roles: Array<string>

    @Field()
    @prop({ default: Date.now })
    createdAt: Date

    @Field()
    updatedAt: Date

    static paginate: PaginateMethod<User>
}

type PaginateMethod<T> = (
    query?: FilterQuery<T>,
    options?: PaginateOptions,
    callback?: (err: any, result: PaginateResult<T>) => void
) => Promise<PaginateResult<T>>

export const UserModel = getModelForClass(User)
