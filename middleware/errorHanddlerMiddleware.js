import { errorResponse } from "../vendor/response.js"

export const errorHanddlerMiddleware = async (error, req, res, next) => {
    if (error) {
        res.status(error.statusCode || 500).json(errorResponse(error))
    }
}