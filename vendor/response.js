export const successResponse = (data, message) => {
    const response = {
        message,
        data
    }
    return response
}

export const errorResponse = (message) => {
    if (typeof message === 'string') {
        return {message : message}
    } else if (typeof message === 'object') {    
        if (message.code == 11000) {
            return {message : "duplicate key error collection", path : message.keyValue}
        } else if (message.message.includes("validation failed")) {
            const errorMessage = message.split(', ')
            const keyValue = errorMessage[0].split(':')[0]
            return { [keyValue] : [errorMessage.map(msg => msg.replace(keyValue + ': ','').split(': ')[1])] }
        } else {
            return {message : message.message}
        }
    }
    return {message : message.message}
}