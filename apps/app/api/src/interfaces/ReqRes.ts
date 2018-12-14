import { Request, Response } from 'express'

export type IRequest = Request & {
  allParams(): any
}

export type IResponse = Response & {
  success(data: any, count?: number, showPagination?: boolean): any
  error(message: any, code?: number): any
  bulkSuccess(success: any, failure: any): any
}