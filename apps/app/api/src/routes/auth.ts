/**
 * Auth routes.
 * Author - Sulay Sumaria
 */
import { Router } from 'express'
import { auth } from './../controllers/auth'

export const authRoutes = (router: Router) => {
  router.post('/auth/jwt', auth.login)
}
