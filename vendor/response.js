export const successResponse = (data, message) => {
    const response = {
        message,
        data
    }
    return response
}

export const errorResponse = (message) => {
    const response = {
        message : message
    }
    return response
}