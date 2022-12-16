export default (query) => {
  if (query.page < 0) query.page = 1
  if (query.limit < 1) query.limit = 10 
  const page = query.page || 1
  const limit = query.limit || 10
  const skip = (page - 1) * limit
  return {limit, skip}
}