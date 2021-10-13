import { Field, ObjectType } from 'type-graphql'
import { Product } from '../../models/Product'
import { User, UserModel } from '../../models/User'
import { FieldError } from '../shared/FieldError'
import { IMutationRepsponse } from '../shared/MutationResponse'

@ObjectType({ implements: IMutationRepsponse })
export class ProductMutaionReponse implements IMutationRepsponse {
    code: number
    success: boolean
    message?: string

    @Field({ nullable: true })
    product?: Product

    @Field((_type) => [FieldError], { nullable: true })
    error?: FieldError[]
}
