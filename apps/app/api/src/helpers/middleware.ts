/**
 * Middleware helper.
 * Contains functions related to logging.
 * Author - Sulay Sumaria
 */
import { NextFunction } from 'express'
import * as _ from 'lodash'
import { IRequest, IResponse } from '../interfaces/ReqRes'
import { logger } from './logger'

export default (req: IRequest, res: IResponse, next: NextFunction) => {
  // Combine all params from query and body.
  req.allParams = (): any => {
    const params = _.merge(req.params, req.query, req.body)
    const limit = parseInt(params.limit) || 0
    const page = parseInt(params.page) || 1

    // pagination details.
    params._paginate = {
      limit: limit,
      page: page,
      skip: (page - 1) * limit,
    }

    return params
  }

  // send error in response.
  res.error = (message: string = 'Internal Server Error', code: number = 500) => {
    return res.status(code).json({ message: message })
  }

  // send success in response.
  res.success = (data: any = '', count: number = 0, showPagination: boolean = false) => {
    if (showPagination) {
      // send response with pagination data.
      const params = _.merge(req.params, req.query, req.body)
      const limit = parseInt(params.limit) || 0
      const page = parseInt(params.page) || 1
      return res.status(200).json({ data: data, total: count, limit: limit, page: page })
    } else {
      // convert string data to json.
      // before: data = 'Some response'
      // after: data = { data: 'Some response' }
      if (_.isString(data)) {
        data = { data }
      }
      return res.status(200).json(data)
    }
  }

  // special success response for bulk insert.
  res.bulkSuccess = (success: any = [], failure: any = []) => {
    return res.status(200).json({ success, failure })
  }

  next()
}

logger.log('middleware loaded.')
