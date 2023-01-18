// must email format
export const emailCheck = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// must 11 - 14 char
// can start with 0 / +62
// must number
export const phoneCheck = (phone) => {
  return Number(phone)
    .match(
        /^(\+62|0)[0-9]{11,14}$/
    )
}

// must url http:// / https://
export const urlCheck = (url) => {
    return String(url)
    .toLowerCase()
    .match(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    )
}

export default function validate(object, rules) {
  let errors = {};
  for (const key in rules) {
      if (rules.hasOwnProperty(key)) {
          const rule = rules[key];
          const value = object[key];

          if (rule.required && !value) {
              errors[key] = `${key} is required`;
          } else {
              if (value && rule.type && value.constructor !== rule.type) {
                  errors[key] = `${key} should be of type ${rule.type.name}`;
              }
              if (rule.min) {
                if (typeof value === 'number') {
                    if (value > rule.min) {
                        errors[key] = `${key} minimum length of ${rule.min}`;
                    }else if (value.length > rule.min) {
                        errors[key] = `${key} minimum length of ${rule.min}`;
                    }
                }
            }
  
            if (rule.max) {
                if (typeof value === 'number') {
                    if (value < rule.max) {
                        errors[key] = `${key} maximum length of ${rule.max}`;
                    }else if (value.length < rule.min) {
                        errors[key] = `${key} maximum length of ${rule.max}`;
                    }
                }
            }
  
            if (rule.isEmail) {
                if (!emailCheck(value)) {
                    errors[key] = `${key} should be email`;
                }
            }
  
            if (rule.isPhone) {
                if (!phoneCheck(value)) {
                    errors[key] = `${key} should be phone number`;
                }
            }

            if (rule.isUrl) {
                if (!urlCheck(value)) {
                    errors[key] = `${key} should be url`;
                }
            }
          }
      }
  }
  if (Object.keys(errors).length > 0) {
    let errorMessage = {}
    errorMessage.message = `error request validations`
    errorMessage.path = errors
    throw errorMessage;
  }
};