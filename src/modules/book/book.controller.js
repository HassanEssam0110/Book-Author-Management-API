import { Book } from "../../../database/models/book.model.js"
import { createOne, deleteOne, getAll, getOne, updateOne } from "../../utils/handlers-factory.utils.js"

export const getBookList = getAll(Book, "Book", [
    { path: "author", select: "name" },
    { path: 'createdBy', select: 'name email' }]);

export const getBook = getOne(Book, [
    { path: "author", select: "name books" },
    { path: 'createdBy', select: 'name email' }]);

export const createBook = createOne(Book);

export const updateBook = updateOne(Book);

export const deleteBook = deleteOne(Book);