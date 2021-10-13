import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CartModel } from '../models/Cart'
import { OrderModel } from '../models/Order'
import { CustomContext } from '../types/shared/CustomContext'
import { StripeInput } from '../types/stripe/StripeInput'
import { RegisterInput } from '../types/user/RegisterInput'
const stripe = require('stripe')(
    'sk_test_51JiMBVKSxZAvMgXEeqCHgoFBDaSMBlhPbfZVl132Ar151VZQsAe8r4naOSvEx240ykbGzL2HKajE1tqFRiKmwXNv00VIBQM24i'
)

@Resolver()
export class StripeResolver {
    @Mutation((_return) => Boolean)
    async payment(
        @Arg('stripeInput') stripeInput: StripeInput,
        @Ctx() { req }: CustomContext
    ): Promise<boolean> {
        await stripe.charges.create(
            {
                source: stripeInput.tokenId,
                amount: stripeInput.amount,
                currency: 'usd',
            },
            async (stripeErr, stripeRes) => {
                if (stripeErr) {
                    console.log('stripeErr', stripeErr)
                    return false
                } else {
                    console.log('stripeRes', stripeRes)
                    const carts = await CartModel.find({ userId: req.session.userId })
                    const orderModel = new OrderModel({
                        userId: req.session.userId,
                        products: carts.map((t) => t.product),
                        total: parseInt(stripeInput.amount) / 100,
                    })
                    const order = await orderModel.save()
                    await CartModel.deleteMany({ userId: req.session.userId })
                    return true
                }
            }
        )

        return false
    }
}
