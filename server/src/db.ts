import mongoose from 'mongoose'
import { env } from './config/env.js'

export const connectDatabase = async () => mongoose.connect(env.MONGODB_URI)
export const disconnectDatabase = async () => mongoose.disconnect()
