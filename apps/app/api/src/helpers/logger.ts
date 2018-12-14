/**
 * Logging helper.
 * Contains functions related to logging.
 * Author - Sulay Sumaria
 */
import * as fs from 'fs'
import * as LOGGER from 'tracer'
import { config } from './../config'

const transports: any[] = [
  (data: any) => {
    fs.appendFile('./output.log', data.output + '\n', err => {
      if (err) throw err
    })
  },
]

if (config.logging.enable_console === 'true') {
  transports.push((data: any) => {
    console.log(data.output)
  })
}

export const logger = LOGGER.colorConsole({
  format: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
  transport: transports,
})
