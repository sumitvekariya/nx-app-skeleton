/**
 * User Controller.
 * Contains functions related to user collection.
 * Author - Sulay Sumaria
 */
import * as _ from 'lodash'
import { logger } from '../helpers/logger'
import { IRequest, IResponse } from '../interfaces/ReqRes'
import { User } from '../models/user'
import { authorization } from '../helpers/authorization'

/**
 * @api {GET} /users Get all Users
 * @apiVersion 0.0.1
 * @apiDescription Get all Users.
 *
 * @apiGroup User
 * @apiName GetAllUsers
 *
 * @apiHeader {String} Authorization Auth token.
 *
 * @apiParam {number} [limit] Limit the number of records to fetch
 * @apiParam {number} [page] Page number to get records of. (Used with limit)
 *
 * @apiSuccess {String} token Token Generated.
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *    data: [{
 *      _id: '',
 *      lastName: '',
 *      firstName: '',
 *      email: ''
 *    }],
 *    total: 10001,
 *    limit: 10000,
 *    page: 2
 * }
 *
 */

/**
 * @api {GET} /users/:id Get single User Details
 * @apiVersion 0.0.1
 * @apiDescription Get single User's data
 *
 * @apiGroup User
 * @apiName GetSingleUser
 *
 * @apiHeader {String} [Authorization] Auth token.
 *
 * @apiParam {number} [limit] Limit the number of records to fetch
 * @apiParam {number} [page] Page number to get records of. (Used with limit)
 * @apiParam {string} id ID of user to get
 *
 * @apiSuccessExample {json} If not authenticated
 * {
 *    data: [{
 *      _id: '',
 *      lastName: '',
 *      firstName: '',
 *      email: ''
 *    }],
 *    total: 10001,
 *    limit: 10000,
 *    page: 2
 * }
 *
 * @apiSuccessExample {json} If authenticated
 * {
 *    data: [{
 *      _id: '5b4a0aea022d4013c4fa47bb',
 *      phone: '',
 *      profilePhoto: '',
 *      email: 'asd@asd.asd',
 *      lastName: 'sumaria',
 *      firstName: 'sulay',
 *      createdAt: '2018-07-14T14:38:34.891Z',
 *      updatedAt: '2018-07-14T14:38:34.891Z',
 *      __v: 0
 *    }],
 *    total: 1,
 *    limit: 0,
 *    page: 1
 * }
 */

async function getUser(req: IRequest, res: IResponse) {
  // get pagination data form params.
  let params = req.allParams()
  let token = req.get('Authorization')
  let { _paginate, id } = params
  let decodedToken
  let getPublicData = false

  try {
    if (token) {
      // if authenticated, send all info.

      token = token.split(' ')[1]

      // decode token and validate it.
      decodedToken = await authorization.verifyToken(token)

      // check if token expired.
      if (decodedToken.id && new Date().getTime() > decodedToken.exp) {
        getPublicData = true
        _getUsers()
      } else {
        return res.error('Token not valid.')
      }
    } else {
      // send public info of all users.
      _getUsers()
    }
  } catch (e) {
    logger.error(e)
    return res.error(e)
  }

  async function _getUsers() {
    let userQuery = {}

    if (id) {
      if (_.get(decodedToken, 'id', false).toString() === id) {
        getPublicData = false
      }
      userQuery = { _id: id }
    }

    let fieldsToGet = '-password -salt -authToken'

    if (getPublicData) {
      fieldsToGet = 'firstName lastName profilePhoto'
    }

    // get users
    let { users, count } = await User.getUsers(userQuery, fieldsToGet, [], _paginate)

    // send response
    return res.success(users, count, true)
  }
}

/**
 * @api {POST} /users Create a User
 * @apiVersion 0.0.1
 * @apiDescription Create a User
 *
 * @apiGroup User
 * @apiName CreateUser
 *
 * @apiHeader {String} Authorization Auth token.
 *
 * @apiParam {string} firstName       FirstName
 * @apiParam {string} lastName        LastName
 * @apiParam {string} email           Email address
 * @apiParam {string} [phone]         Phone
 * @apiParam {string} password        Password
 * @apiParam {file}   [profilePhoto]  Photo.
 *
 * @apiSuccessExample {json} 200 OK
 * {
 *    _id: '',
 *    phone: '',
 *    profilePhoto: '',
 *    email: '',
 *    lastName: '',
 *    firstName: '',
 *    createdAt: '',
 *    updatedAt: ''
 * }
 */
async function createUser(req: IRequest, res: IResponse) {
  try {
    let params = req.allParams()

    // hash password
    params.salt = authorization.makeSalt()
    params.password = authorization.encryptPassword(params.password, params.salt)

    // create user object
    let user = await User.create(params)

    // remove password and related fields from sending in response.
    if (user) {
      user = await User.findById(user._id)
        .lean()
        .exec()
      return res.success(user)
    } else {
      return res.error('Some error occurred.')
    }
  } catch (e) {
    logger.error(e)
    return res.error(e)
  }
}

/**
 * @api {PUT} /users/:id Update a User
 * @apiVersion 0.0.1
 * @apiDescription Update a User
 *
 * @apiGroup User
 * @apiName UpdateUser
 *
 * @apiHeader {String} Authorization Auth token.
 *
 * @apiParam {string} id                ID of user to update
 * @apiParam {string} [firstName]       FirstName
 * @apiParam {string} [lastName]        LastName
 * @apiParam {string} [email]           Email address
 * @apiParam {string} [phone]           Phone
 * @apiParam {string} [password]        Password
 * @apiParam {file}   [profilePhoto]    Photo.
 *
 * @apiSuccessExample {json} 200 OK
 * {
 *    _id: '',
 *    phone: '',
 *    profilePhoto: '',
 *    email: '',
 *    lastName: '',
 *    firstName: '',
 *    createdAt: '',
 *    updatedAt: ''
 * }
 */
async function updateUser(req: IRequest, res: IResponse) {
  try {
    let params = req.allParams()
    let { id, password } = params
    let token = req.get('Authorization')
    token = token.split(' ')[1]

    if (!user) {
      return res.error('User not found.')
    }

    // decode token and validate it.
    let decodedToken: any = await authorization.verifyToken(token)

    // user can update his data only.
    if (decodedToken.id === id) {
      let user = await User.findById(id)
        .lean()
        .exec()
      if (authorization.encryptPassword(password, user.salt) !== user.password) {
        // password updated.
        password = authorization.encryptPassword(password, user.salt)
      }

      // update user
      let newUser = await User.findOneAndUpdate({ _id: id }, params, { new: true })
        .select('-password -salt -authToken')
        .exec()

      return res.success(newUser)
    } else {
      return res.error('Cannot update another users data.')
    }
  } catch (e) {
    logger.error(e)
    return res.error(e)
  }
}

export const user = {
  getUser,
  createUser,
  updateUser,
}
