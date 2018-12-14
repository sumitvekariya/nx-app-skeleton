/**
 * Auth Controller.
 * Contains functions related to authentication.
 * Author - Sulay Sumaria
 */
import { authorization } from '../helpers/authorization'
import { IRequest, IResponse } from '../interfaces/ReqRes'
import { User } from '../models/user'

/**
 * @api {POST} /auth/jwt Login
 * @apiVersion 0.0.1
 * @apiDescription Login.
 *
 * @apiGroup Auth
 * @apiName Login-JWT
 *
 * @apiSuccess {String} token Token Generated.
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *    data: '{{token}}'
 * }
 *
 */
async function login(req: IRequest, res: IResponse) {
  let params = req.allParams()
  let { email, password } = params

  // check for email id and password.
  let user = await User.findOne({ email: email }).exec()

  // check if user exists.
  if (!user) {
    return res.error('User not found.')
  }

  // check password.
  if (authorization.encryptPassword(password, user.salt) !== user.password) {
    return res.error('Password not matched')
  }

  // generate token.
  let tokenData = {
    id: user._id,
    email: email,
    time: Date.now(),
  }
  let token = authorization.generateToken(tokenData)

  return res.success({ token })
}

export const auth = {
  login,
}
