import { Arg, Ctx, FieldResolver, Mutation, Query, Root, UseMiddleware } from 'type-graphql'
import { CheckAdminAuth, CheckAuth } from '../middleware/checkAuth'
import { Cart, CartModel } from '../models/Cart'
import { CartMutationRespsone } from '../types/cart/CardMutationRespsone'
import { CreateCartInput, UpdateCartInput } from '../types/cart/CreateCartInput'
import { CustomContext } from '../types/shared/CustomContext'
import mongoose, { ObjectId } from 'mongoose'
import { GetCardByUserMutationResponse } from './../types/cart/GetCardByUserMutationResponse'
import { Product } from './../models/Product'
import { BaseMutationRepsponse } from '../types/shared/MutationResponse'

export class CartResolver {
    @Mutation((_return) => CartMutationRespsone)
    @UseMiddleware(CheckAuth)
    async createCart(
        @Arg('createCartInput') { productId, quantity }: CreateCartInput,
        @Ctx() { req }: CustomContext
    ): Promise<CartMutationRespsone> {
        try {
            let newCart = new CartModel({
                userId: req.session.userId,
                product: productId,
                quantity,
            })
            newCart = await newCart.save()

            const result = await CartModel.findOne({ _id: newCart._id }).populate(
                'product',
                null,
                'Product'
            )

            return {
                code: 200,
                success: true,
                message: 'created cart success',
                cart: result,
            }
        } catch (error) {
            console.log(error)
            return {
                code: 500,
                success: true,
                message: 'Internal error',
                cart: null,
            }
        }
    }

    @Mutation((_return) => CartMutationRespsone)
    @UseMiddleware(CheckAuth)
    async updateCart(
        @Arg('updateCartInput') { cartId, quantity }: UpdateCartInput,
        @Ctx() { req }: CustomContext
    ): Promise<CartMutationRespsone> {
        try {
            if (quantity > 0) {
                const updatedCart = await CartModel.findByIdAndUpdate(
                    {
                        _id: cartId,
                    },
                    {
                        $set: { quantity: quantity },
                    },
                    { new: true }
                ).populate('product', null, 'Product')

                return {
                    code: 200,
                    success: true,
                    message: 'update cart success',
                    cart: updatedCart,
                }
            } else {
                const updatedCart = await CartModel.findByIdAndDelete({
                    _id: cartId,
                })

                return {
                    code: 200,
                    success: true,
                    message: 'update cart success',
                }
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

    @Query((_return) => GetCardByUserMutationResponse)
    async getCartByUser(@Ctx() { req }: CustomContext): Promise<GetCardByUserMutationResponse> {
        try {
            const carts = await CartModel.find({ userId: req.session.userId }).populate(
                'product',
                null,
                'Product'
            )

            let total = 0
            carts.map((item) => {
                total += item.quantity * ((item.product as any)?.price ?? 0)
            })

            return {
                code: 200,
                success: true,
                message: 'getCartByUser success',
                carts: carts,
                total,
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

    @Mutation((_return) => BaseMutationRepsponse)
    @UseMiddleware(CheckAuth)
    async deleteCartByUser(@Ctx() { req }: CustomContext): Promise<BaseMutationRepsponse> {
        try {
            const carts = await CartModel.findByIdAndDelete(req.session.userId)
            return {
                code: 200,
                success: true,
                message: 'deleteCartByUser success',
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
