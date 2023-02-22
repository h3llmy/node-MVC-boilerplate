import bcrypt from 'bcrypt'

export const hasPassword = (password) => {
    return bcrypt.hash(password, 10)
}

export const comparePassword = (enteredPassword, currentPassword) => {
    return bcrypt.compareSync(enteredPassword, currentPassword)
}