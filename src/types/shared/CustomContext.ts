import { Request, Response } from 'express'
import { Session, SessionData } from 'express-session'
import mongoose from 'mongoose'
import { buildDataLoaders } from '../../ultilities/dataLoader'

export type CustomContext = {
    req: Request & { session?: Session & Partial<SessionData> & { userId?: number } }
    // req: Request
    res: Response
    // connection: mongoose
    dataLoaders: ReturnType<typeof buildDataLoaders>
}
