/**
 * Routes.
 * Author - Sulay Sumaria
 */
import { Router } from 'express'
import { authRoutes } from './auth'
import { userRoutes } from './user'

const router: Router = Router()

// auth routes
authRoutes(router)

// user routes
userRoutes(router)

export default router
