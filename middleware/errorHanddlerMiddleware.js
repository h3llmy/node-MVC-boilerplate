import { errorResponse } from "../vendor/response.js"

export const errorHanddlerMiddleware = async (error, req, res, next) => {
    if (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json(errorResponse(error))
    }
}