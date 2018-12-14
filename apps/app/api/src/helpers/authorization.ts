/**
 * Auth helper.
 * Contains functions related to authorization.
 * Author - Sulay Sumaria
 */
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'
import { User } from './../models/user'
import { config } from './../config'
import { logger } from './logger'
import * as crypto from 'crypto'

const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

// generate salt
function makeSalt() {
  return Math.round(new Date().valueOf() * Math.random()) + ''
}

// hash password
function encryptPassword(password, salt) {
  if (!password || !salt) {
    return ''
  }
  try {
    return crypto
      .createHmac('sha1', salt)
      .update(password)
      .digest('hex')
  } catch (e) {
    logger.error(e)
    return ''
  }
}

// generate token
function generateToken(tokenData: any, expiresIn: number = 3600) {
  try {
    return jwt.sign(tokenData, config.jwtSecret, { expiresIn })
  } catch (e) {
    logger.error(e)
    return ''
  }
}

// verify and decode token
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (e, decoded) => {
      if (e) {
        reject(e)
      } else {
        resolve(decoded)
      }
    })
  })
}

// jwt authentication.
function jwtAuthentication(passport) {
  let jwtOptions: passportJWT.StrategyOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: config.jwtSecret,
  }
  passport.use(
    new JwtStrategy(jwtOptions, (payload, next) => {
      User.findOne({ email: payload.email }).exec((err, user) => {
        if (user) {
          next(null, user)
        } else {
          next(null, false)
        }
      })
    }),
  )
}

// authorize using passport jwt
const authorize = passport.authenticate('jwt', { session: false })

export const authorization = {
  jwtAuthentication,
  authorize,
  generateToken,
  makeSalt,
  encryptPassword,
  verifyToken,
}
