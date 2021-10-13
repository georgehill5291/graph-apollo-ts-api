import { Field, InterfaceType, ObjectType } from 'type-graphql'

@InterfaceType()
export abstract class IMutationRepsponse {
    @Field()
    code: number

    @Field()
    success: boolean

    @Field({ nullable: true })
    message?: string
}

@ObjectType()
export class BaseMutationRepsponse {
    @Field()
    code: number

    @Field()
    success: boolean

    @Field({ nullable: true })
    message?: string
}
