/**
 * User Model.
 * Author - Sulay Sumaria
 */
import { Document, model, Model, Schema } from 'mongoose'

// interface for fields of model.
export interface IUser {
  firstName: string
  lastName: string
  email: string
  phone: string // string because can start with 0
  profilePhoto: string // URL of photo
  authToken: string // To save the auth token.
  password: string // saved in hashed format.
  salt: string // salt for passowrd.
}

// interface for document of model. includes "methods"
export interface IUserDocument extends IUser, Document {}

// interface for model. includes "statics"
export interface IUserModel extends Model<IUserDocument> {
  getUsers(query: any, fieldsToGet: string, populateArray: any[], paginate: any): Promise<{ users: IUserDocument[]; count: number }>
  addUser(userObj: any): Promise<IUserDocument>
}

// Schema
let UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'firstName is required.'],
    },
    lastName: {
      type: String,
      required: [true, 'lastName is required.'],
    },
    email: {
      type: String,
      required: [true, 'email is required.'],
    },
    phone: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    authToken: {
      type: String,
      default: '',
      select: false,
    },
    password: {
      type: String,
      required: [true, 'password is required.'],
    },
    salt: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
)

UserSchema.statics.getUsers = function(query, fieldsToGet, populateArray, paginate = { skip: 0, limit: 0 }) {
  return new Promise(async (resolve, reject) => {
    try {
      let [count, users] = await Promise.all([
        this.countDocuments(query).exec(),
        this.find(query)
          .select(fieldsToGet)
          .populate(populateArray)
          .skip(paginate.skip)
          .limit(paginate.limit)
          .lean()
          .exec(),
      ])
      resolve({ users, count })
    } catch (e) {
      reject(e)
    }
  })
}

export const User: IUserModel = <IUserModel>model<IUserDocument>('users', UserSchema)
