import { Router } from "express";
import { getBookList, createBook, getBook, updateBook, deleteBook } from "./book.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { validatorMiddleware } from './../../middlewares/validation.middleware.js';
import { createBookVlidator, deleteBookValidator, getBookListValidator, getBookValidator, updateBookValidator } from "./book.validation.js";


const bookRouter = Router();

bookRouter.use(auth);

bookRouter.route('/')
    .get(validatorMiddleware(getBookListValidator), getBookList)
    .post(validatorMiddleware(createBookVlidator), createBook)

bookRouter.route('/:id')
    .get(validatorMiddleware(getBookValidator), getBook)
    .patch(validatorMiddleware(updateBookValidator), updateBook)
    .delete(validatorMiddleware(deleteBookValidator), deleteBook)

export default bookRouter;