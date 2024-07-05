import { catchError } from "../middlewares/error/catch-error.middleware.js";
import { ApiError } from './api-error.utils.js';
import { sendResponse } from "./send-response.utils.js";
import ApiFeatures from './api-features.utils.js';


/**
 * Creates a new document in the given model.
 * @param {Model} Model - The Mongoose model to create the document in.
 * @returns {Function} - A middleware function to handle the creation of the document.
 */
export const createOne = (Model) => catchError(async (req, res, next) => {
    req.body.createdBy = req.user._id;
    const newDocument = await Model.create(req.body);
    return sendResponse(res, { data: newDocument });
});




/**
 * Deletes a single document by ID from the given model.
 * @param {Model} Model - The Mongoose model to delete the document from.
 * @returns {Function} - A middleware function to handle the deletion of the document.
 */
export const deleteOne = (Model) => catchError(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) return next(new ApiError('Oops,not found!', 404));
    if (document.createdBy.toString() !== req.user._id.toString()) return next(new ApiError('Sorry,You do not have permission to delete this document.', 403));

    await Model.findByIdAndDelete(req.params.id);
    return sendResponse(res);
});

/**
 * Updates a single document by ID in the given model.
 * @param {Model} Model - The Mongoose model to update the document in.
 * @returns {Function} - A middleware function to handle the updating of the document.
 */
export const updateOne = (Model) => catchError(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) return next(new ApiError('Oops,not found!', 404));
    if (document.createdBy.toString() !== req.user._id.toString()) return next(new ApiError('Sorry,You do not have permission to update this document.', 403));

    req.body.updatedAt = new Date();
    const documentUpdated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendResponse(res, { data: documentUpdated });
});

/**
 * Retrieves all documents from the given model with optional filtering, sorting, field limiting, searching, and pagination.
 * @param {Model} Model - The Mongoose model to retrieve documents from.
 * @param {string} modelName - The name of the model (for special handling in search functionality).
 * @param {Object} [populationOpt] - The population options to populate related fields.
 * @returns {Function} - A middleware function to handle the retrieval of all documents.
 */
export const getAll = (Model, modelName, populationOpt) => catchError(async (req, res, next) => {
    const countDocuments = await Model.countDocuments();
    // Build the query with various features: pagination, filtering, field limiting, and sorting
    let apiFeatures = new ApiFeatures(Model.find(), req.query)
        .paginate(countDocuments)
        .filter()
        .limitFields()
        .sort()

    // Apply the search functionality asynchronously
    apiFeatures = await apiFeatures.search(modelName)

    // Destructure the mongooseQuery and paginationResults from the apiFeatures
    const { mongooseQuery, paginationResults } = apiFeatures;

    // If population options are provided, populate the query with the specified options
    if (populationOpt) {
        mongooseQuery.populate(populationOpt)
    }

    // Execute the query and get the documents
    const documents = await mongooseQuery;
    return sendResponse(res, { total: countDocuments, results: documents.length, paginationResults, data: documents });
});


/**
 * Retrieves a single document by ID from the given model.
 * @param {Model} Model - The Mongoose model to retrieve the document from.
 * @param {Object} [populationOpt={}] - The population options to populate related fields.
 * @returns {Function} - A middleware function to handle the retrieval of the document.
 */
export const getOne = (Model, populationOpt = {}) => catchError(async (req, res, next) => {
    // 1- Buld Query
    let query = Model.findById(req.params.id)

    if (populationOpt) {
        query.populate(populationOpt)
    }

    // 2- Execute Query
    const document = await query;
    if (!document) return next(new ApiError('Oops,not found!', 404));

    return sendResponse(res, { data: document });
});