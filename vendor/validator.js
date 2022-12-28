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
  return Number(phone).match(/^(\+62|0)[0-9]{11,14}$/)
}