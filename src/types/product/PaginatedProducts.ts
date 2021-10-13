import { Field, ObjectType } from 'type-graphql'
import { Product } from '../../models/Product'

@ObjectType()
export class PaginatedProducts {
    @Field()
    hasNext: boolean

    @Field()
    hasPrevious: boolean

    @Field({ nullable: true })
    next: string | null

    @Field({ nullable: true })
    previous: string | null

    @Field()
    totalDocs: number

    @Field((_type) => [Product])
    docs?: Product[]
}
