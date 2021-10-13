import DataLoader from 'dataloader'
import mongoose from 'mongoose'
import { User, UserModel } from '../models/User'

const batchGetUsers = async (userIds: number[]) => {
    const users = await UserModel.find({
        _id: {
            $in: [
                mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
                mongoose.Types.ObjectId('4ed3f117a844e0471100000d'),
                mongoose.Types.ObjectId('4ed3f18132f50c491100000e'),
            ],
        },
    })
    return userIds.map((userId) => users.find((user) => user.id === userId))
}

export const buildDataLoaders = () => ({
    userLoader: new DataLoader<number, User | undefined>((userIds) =>
        batchGetUsers(userIds as number[])
    ),
})
