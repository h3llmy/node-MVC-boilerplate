// must email format
export const emailCheck = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

// must 11 - 14 char
// can start with 0 / +62
// must number
export const phoneCheck = (phone) => {
  return String(phone).match(/^(?:\+62|0)[2-9]\d{7,12}$/)
}

// must url http:// / https://
export const urlCheck = (url) => {
  return String(url)
    .toLowerCase()
    .match(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    )
}

function validateObject(object, rules, prefix = '') {
  let errors = {}
  let validated = {}
  for (const key in rules) {
    if (rules.hasOwnProperty(key)) {
      const rule = rules[key]
      let value = object[key]
      let fieldPrefix = prefix ? `${prefix}.${key}` : key

      if (rule.required && !value) {
        errors[fieldPrefix] = `${fieldPrefix} is required`
      } else {
        if (rule.type == Number) {
          value = Number(value)
          if (!value) {
            errors[fieldPrefix] = `${fieldPrefix} should be of type ${rule.type.name}`
          }
        } else if (value && rule.type && value.constructor !== rule.type) {
          errors[fieldPrefix] = `${fieldPrefix} should be of type ${rule.type.name}`
        }
        if (rule.min) {
          if (typeof value === 'number') {
            if (value < rule.min) {
              errors[fieldPrefix] = `${fieldPrefix} minimum length of ${rule.min}`
            }
          }
          else if (value.length < rule.min) {
            errors[fieldPrefix] = `${fieldPrefix} minimum length of ${rule.min}`
          }
        }

        if (rule.max) {
          if (typeof value === 'number') {
            if (value > rule.max) {
              errors[fieldPrefix] = `${fieldPrefix} maximum length of ${rule.max}`
            }
          } else if (value.length > rule.max) {
            errors[fieldPrefix] = `${fieldPrefix} maximum length of ${rule.max}`
          }
        }
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          const nestedValidation = validateObject(value, rule.fields, fieldPrefix)
          errors = { ...errors, ...nestedValidation.errors }
          validated[key] = nestedValidation.validated
        } else if (value && Array.isArray(value)) {
          if (rule.fields && typeof rule.fields === 'object') {
            validated[key] = []
            value.forEach((item, index) => {
              const nestedValidation = validateObject(item, rule.fields, `${fieldPrefix}[${index}]`)
              errors = { ...errors, ...nestedValidation.errors }
              validated[key].push(nestedValidation.validated)
            })
          } else {
            errors[fieldPrefix] = `${fieldPrefix} should be of type array of objects`
          }
        }
        if (rule.isEmail) {
          if (!emailCheck(value)) {
            errors[fieldPrefix] = `${fieldPrefix} should be email`
          }
        }

        if (rule.isPhone) {
          if (!phoneCheck(value)) {
            errors[fieldPrefix] = `${fieldPrefix} should be phone number`
          }
        }

        if (rule.isUrl) {
          if (!urlCheck(value)) {
            errors[fieldPrefix] = `${fieldPrefix} should be url`
          }
        }

        if (rule.pattern) {
          const regex = new RegExp(rule.pattern)
          if (!regex.test(value)) {
            errors[fieldPrefix] = `${fieldPrefix} does not match the required pattern`
          }
        }

        if (value) {
          validated[key] = value
        }
      }
    }
  }
  return { errors, validated }
}



export default function validate(object, rules) {
  const { errors, validated } = validateObject(object, rules)
  if (Object.keys(errors).length > 0) {
    let errorMessage = {}
    errorMessage.message = `error validations`
    errorMessage.path = errors
    errorMessage.statusCode = 400
    throw errorMessage
  } else {
    return validated
  }
}