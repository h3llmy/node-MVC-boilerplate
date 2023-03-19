export const successResponse = (data, message) => {
  const response = {
    message,
    data,
  }
  return response
}

export const errorResponse = (message) => {
  delete message?.statusCode
  if (process.env.NODE_ENV === 'development') {
    console.log('\x1b[31m%s\x1b[0m', 'Error : ' + message.message, new Error().stack.replace("Error", ""));
  }
  if (typeof message === 'string') {
    return { message: message }
  }
  if (typeof message === 'object') {
    if (message.code == 11000) {
      return {
        message: 'duplicate key error collection',
        path: message.keyValue,
      }
    }
    if (message.message.includes('validation failed')) {
      const errorMessage = message.message.split(', ')
      const keyValue = errorMessage[0].split(':')[0]
      return {
        [keyValue]: [
          errorMessage.map(
            (msg) => msg.replace(keyValue + ': ', '').split(': ')[1]
          ),
        ],
      }
    }
    if (message.message.includes('error validations')) {
      return message
    } else {
      return { message: message.message }
    }
  }
  return { message: message.message }
}
