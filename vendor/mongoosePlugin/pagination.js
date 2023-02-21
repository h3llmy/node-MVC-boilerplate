import CustomError from "../customError.js";

export default function paginatePlugin(schema, options) {
    try {
        schema.statics.paginate = async function (filter, query) {
            const paginations = (query) => {
                if (query.page < 0) query.page = 1
                if (query.limit < 1) query.limit = 10
                const page = query.page || 1
                const limit = query.limit || 10
                const skip = (page - 1) * limit
                return { limit, skip }
            }

            const pageCount = (query, totalDocument) => {
                return Math.ceil(totalDocument / (query.limit || 10))
            }
            const schemaFind = await this.find(filter, {}, paginations(query))
                .orFail(new CustomError(this.modelName + ' not found', 404))

            const totalPages = pageCount(query, await this.countDocuments(filter))

            return {
                totalPages: totalPages,
                list: schemaFind
            }
        };
        return schema;
    } catch (error) {
        throw new Error(error)
    }

}
