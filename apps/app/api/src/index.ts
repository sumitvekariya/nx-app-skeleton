import { default as App } from './main'
import { config } from './config'
import { IAppOptions } from './interfaces/AppOptions'

// set config options for app.
const options: IAppOptions = {
  PORT: config.app.port,
  mongoURL: config.app.dburl,
  baseRoute: config.app.baseRoute,
  rootDir: __dirname, // dont change this unless you know what you are replacing with.
}

const app: App = new App(options)

// initialize app
app.init()
