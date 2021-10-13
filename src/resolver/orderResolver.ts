import { Ctx, Query, UseMiddleware } from 'type-graphql'
import { CheckAuth } from '../middleware/checkAuth'
import { OrderModel } from '../models/Order'
import { GetOrderByUserMutationResponse } from '../types/order/GetOrderByUserMutationResponse'
import { CustomContext } from '../types/shared/CustomContext'

export class OrderResolver {
    @Query((_return) => GetOrderByUserMutationResponse)
    @UseMiddleware(CheckAuth)
    async getOrderByUser(@Ctx() { req }: CustomContext): Promise<GetOrderByUserMutationResponse> {
        try {
            const orders = await OrderModel.find({ userId: req.session.userId }).populate(
                'products',
                null,
                'Product'
            )

            return {
                code: 200,
                success: true,
                message: 'getOrderByUser success',
                orders: orders,
            }
        } catch (error) {
            console.log(error)
            return {
                code: 500,
                success: true,
                message: 'Internal error',
            }
        }
    }
}
