/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as express from 'express'
import * as session from 'express-session'
import * as mongoose from 'mongoose'
import * as passport from 'passport'
import * as path from 'path'
import * as multer from 'multer'
import { authorization } from './helpers/authorization'
import { logger } from './helpers/logger'
import middleware from './helpers/middleware'
import { IAppOptions } from './interfaces/AppOptions'
import routes from './routes'

// const app = express();

// app.get('/', (req, res) => {
//   res.send(`Welcome to app-api!`);
// });

// const port = 3333;
// app.listen(port, (err) => {
//   if (err) {
//     console.error(err);
//   }
//   console.log(`Listening at http://localhost:${port}`);
// });

logger.log('Starting app...')

class App {
  app: express.Application
  __rootDir: string
  PORT: number
  mongoURL: string
  baseRoute: string

  constructor(options: IAppOptions) {
    this.PORT = options.PORT
    this.mongoURL = options.mongoURL
    this.baseRoute = options.baseRoute
    this.__rootDir = options.rootDir
  }

  loadApp() {
    // compression.
    this.app.use(compression())

    // body-parser
    this.app.use(bodyParser.json({ limit: '50mb' }))
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: '50mb',
        parameterLimit: 50000000,
      }),
    )

    // session
    this.app.use(
      session({
        secret: 'secrettexthere',
        saveUninitialized: true,
        resave: true,
      }),
    )

    // passport authentication
    authorization.jwtAuthentication(passport)
    this.app.use(passport.initialize())

    // middleware: extending req and res objects.
    this.app.use(middleware)

    // routes
    this.app.use(this.baseRoute, routes)

    // static folder for docs.
    this.app.use('/docs', express.static(path.join(this.__rootDir, '..', 'docs')))

    // handling file upload.
    this.app.use(multer().any())
  }

  async init() {
    this.app = express()

    // loading app
    this.loadApp()
    try {
      // mongoose connection
      await mongoose.connect(
        this.mongoURL,
        { useNewUrlParser: true },
      )

      // app listening.
      this.app.listen(this.PORT, () => {
        logger.info(`app started on port ${this.PORT}...`)
      })
    } catch (e) {
      logger.error(e)
      process.exit(1)
    }
  }
}

export default App
