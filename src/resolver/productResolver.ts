import { Arg, Ctx, ID, Int, Mutation, Query, UseMiddleware } from 'type-graphql'
import { CheckAdminAuth } from '../middleware/checkAuth'
import { Product, ProductModel } from '../models/Product'
import { CreateProductInput } from '../types/product/CreateProductInput'
import { PaginatedProducts } from '../types/product/PaginatedProducts'
import { ProductMutaionReponse } from '../types/product/ProductMutaionReponse'
import { UpdateProductInput } from '../types/product/UpdateProductInput'
import { CustomContext } from '../types/shared/CustomContext'

export class ProductResolver {
    @Query((_return) => PaginatedProducts, { nullable: true })
    async products(
        @Arg('color', (_type) => String, { nullable: true }) color: string,
        @Arg('size', (_type) => String, { nullable: true }) size: string,
        @Arg('sort', (_type) => String, { nullable: true }) sort: string,
        @Arg('limit', (_type) => Int) limit: number,
        @Arg('offset', (_type) => Int, { nullable: true }) offset?: number
    ): Promise<PaginatedProducts | null> {
        try {
            let query = {} as any

            if (color) query.color = { $in: color.split(',') }
            if (size) query.size = { $in: size.split(',') }

            var options = {
                sort: { createdAt: -1 },
                offset: offset && offset > 0 ? offset : 0,
                limit: limit && limit != 0 ? limit : 3,
            }

            const products = await ProductModel.paginate(query, options)

            return {
                hasNext: products.hasNextPage,
                hasPrevious: products.hasPrevPage,
                next: products.nextPage,
                previous: products.prevPage,
                totalDocs: products.totalDocs,
                docs: products.docs,
            }
        } catch (error) {
            return null
        }
    }

    @Mutation((_return) => ProductMutaionReponse)
    @UseMiddleware(CheckAdminAuth)
    async createProduct(
        @Arg('createProductInput') { title, desc, img, price }: CreateProductInput,
        @Ctx() { req }: CustomContext
    ): Promise<ProductMutaionReponse> {
        try {
            let newProduct = new ProductModel({
                title,
                desc,
                img,
                price,
            })
            newProduct = await newProduct.save()

            return {
                code: 200,
                success: true,
                message: 'created product success',
                product: newProduct,
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

    @Mutation((_return) => ProductMutaionReponse)
    @UseMiddleware(CheckAdminAuth)
    async updateProduct(
        @Arg('updateProductInput') { id, title, desc, img, price }: UpdateProductInput
    ): Promise<ProductMutaionReponse> {
        try {
            const existingProduct = await ProductModel.findOne({ _id: id })
            if (!existingProduct) {
                return {
                    code: 400,
                    success: false,
                    message: 'product not found',
                }
            }

            existingProduct.title = title
            existingProduct.desc = desc
            existingProduct.img = img
            existingProduct.price = price

            await existingProduct.save()

            return {
                code: 200,
                success: true,
                message: 'update product success',
                product: existingProduct,
            }
        } catch (error) {
            return {
                code: 500,
                success: true,
                message: 'Internal error',
            }
        }
    }

    @Query((_return) => Product, { nullable: true })
    async product(@Arg('id', (_type) => String) id: string): Promise<Product | undefined> {
        const product = await ProductModel.findOne({ _id: id })
        return product
    }

    @Mutation((_return) => Boolean)
    @UseMiddleware(CheckAdminAuth)
    async deleteProduct(@Arg('id', (_type) => String) id: string): Promise<boolean> {
        const deleteUser = await ProductModel.findOneAndDelete({ _id: id })
        return true
    }
}
