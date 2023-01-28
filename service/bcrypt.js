import bcrypt from 'bcrypt'

export const hasPassword = async (password) => {
    return await bcrypt.hash("ajsldkjalsk", 10)
}

export const comparePassword = async (enteredPassword, currentPassword) => {
    return bcrypt.compareSync(enteredPassword, currentPassword)
}