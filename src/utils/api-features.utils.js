import { Author } from './../../database/models/author.model.js';

/**
 * A class to handle various API features like filtering, sorting, field limiting, searching, and pagination.
 */
export class ApiFeatures {
    /**
   * Creates an instance of ApiFeatures.
   * @param {Object} mongooseQuery - The initial Mongoose query.
   * @param {Object} queryString - The query string parameters from the request.
   */
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
        this.paginationResults = {}
    }

    /**
    * Filters out excluded fields from the query.
    * @returns {ApiFeatures} - The current instance of ApiFeatures.
    */
    filter() {
        const queryStringObj = { ...this.queryString };
        const excludesFields = ['limit', 'sort', 'page', 'fields', 'search']
        excludesFields.forEach(ele => delete queryStringObj[ele]);

        this.mongooseQuery = this.mongooseQuery.find(queryStringObj);
        return this;
    }

    /**
     * Sorts the query by specified fields or defaults to `createdAt`.
     * @returns {ApiFeatures} - The current instance of ApiFeatures.
     */
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(' ').join('')
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    /**
     * Limits the fields returned in the query result.
     * @returns {ApiFeatures} - The current instance of ApiFeatures.
     */
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }

        return this;
    }

    /**
    * Searches the query based on the model name and query string parameters.
    * @param {string} modelName - The name of the model to search.
    * @returns {Promise<ApiFeatures>} - A promise that resolves to the current instance of ApiFeatures.
    */
    async search(modelName) {
        if (this.queryString.search) {
            const keyword = this.queryString.search
            let query = {};
            if (modelName === 'Author') {
                query.$or = [
                    { name: { $regex: keyword, $options: 'i' } },
                    { bio: { $regex: keyword, $options: 'i' } },
                ]
            }

            if (modelName === 'Book') {
                const authors = await Author.find({ name: { $regex: keyword, $options: 'i' } }).select("_id");
                const authorsIds = authors?.map(author => author._id.toString())
                query.$or = [
                    { title: { $regex: keyword, $options: 'i' } },
                    { author: { $in: authorsIds } },
                ]
            }

            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    /**
    * Paginates the query results based on the total number of documents.
    * @param {number} countDocuments - The total number of documents.
    * @returns {ApiFeatures} - The current instance of ApiFeatures.
    */
    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 25;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        // Pagination result
        const pagination = {}
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        // next page 
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        // prev page 
        if (skip > 0) {
            pagination.pre = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResults = pagination;

        return this;
    }
}

export default ApiFeatures;