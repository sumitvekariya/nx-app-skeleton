/**
 * User Routes.
 * Author - Sulay Sumaria
 */
import { Router } from 'express'
import { user } from './../controllers/user'
import { authorization } from './../helpers/authorization'

export const userRoutes = (router: Router) => {
  // get all users
  router.get('/users/:id?', user.getUser)

  // create new user
  // removed authorization temporarily.
  router.post('/users', user.createUser)

  // update user
  router.put('/users/:id', authorization.authorize, user.updateUser)
}
