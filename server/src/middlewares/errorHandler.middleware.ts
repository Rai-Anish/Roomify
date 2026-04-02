import { Request, Response, NextFunction } from 'express'
import ApiError from '../utils/ApiError'

const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
    return
  }

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal server error',
    errors: [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}

export default errorHandler