import { Author } from './../../../database/models/author.model.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from '../../utils/handlers-factory.utils.js'

export const getAuthorList = getAll(Author, 'Author',
    [{ path: 'books', select: 'title publishedDate' }
        , { path: 'createdBy', select: 'name email' }]);

export const getAuthor = getOne(Author, [
    { path: 'books', select: 'title publishedDate' },
    { path: 'createdBy', select: 'name email' }]);

export const createAuthor = createOne(Author);

export const updateAuthor = updateOne(Author);

export const deleteAuthor = deleteOne(Author);

