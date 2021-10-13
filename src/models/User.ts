import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
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
}

export const UserModel = getModelForClass(User)
