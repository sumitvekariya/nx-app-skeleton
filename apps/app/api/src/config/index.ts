/**
 * Config file. You can find details about configuration variables in README file.
 * Author - Sulay Sumaria
 */
import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
  logging: {
    enable_console: process.env.ENABLE_CONSOLE || 'false',
  },
  jwtSecret: process.env.JWT_SECRET || 'asdfghjkl',
  app: {
    port: parseInt(process.env.PORT) || 3000,
    dburl: process.env.DBURL || 'mongodb://127.0.0.1:27017/app-one',
    baseRoute: process.env.BASE_ROUTE || '/api/',
  },
}
