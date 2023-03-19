import CustomError from "../customError.js";

export default function paginatePlugin(schema, options) {
    try {
        schema.statics.paginate = async function (filter, query) {
            const paginations = (query) => {
                if (query.page < 0) query.page = 1
                if (query.limit < 1) query.limit = 10
                const page = query.page
                const limit = query.limit
                const skip = (page - 1) * limit
                return { limit, skip }
            }

            const pageCount = (query, totalDocument) => {
                if (query.limit) {
                    return Math.ceil(totalDocument / (query.limit))
                } else {
                    return 1
                }
            }
            const schemaFind = await this.find(filter, {}, paginations(query))
                .orFail(new CustomError(this.modelName + ' not found', 404))

            const totalPages = pageCount(query, await this.countDocuments(filter))

            return {
                totalPages: totalPages,
                currentPage: Number(query.page) || 1,
                list: schemaFind
            }
        };
        return schema;
    } catch (error) {
        throw new Error(error)
    }

}
