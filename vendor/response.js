export const successResponse = (data, message) => {
    const response = {
        message,
        data
    }
    return response
}

export const errorResponse = (message) => {
    let displayValidation
    if (message.includes("validation failed")) {
        const errorMessage = message.split(', ')
        const a = errorMessage[0].split(':')[0]
        displayValidation = { [a] : [errorMessage.map(msg => msg.replace(a + ': ','').split(': ')[1])] }
    } else {
        displayValidation = message
    }
    const response = {
        message : displayValidation
    }
    return response
}