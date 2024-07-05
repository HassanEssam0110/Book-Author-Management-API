import { Router } from "express";
import { createAuthor, deleteAuthor, getAuthor, getAuthorList, updateAuthor } from './author.controller.js';
import { auth } from "../../middlewares/auth.middleware.js";
import { validatorMiddleware } from "../../middlewares/validation.middleware.js";
import { createAuthorValidator, deleteAuthorValidator, getAuthorListValidator, getAuthorValidator, updateAuthorValidator } from "./author.validation.js";



const authorRouter = Router();

authorRouter.use(auth);

authorRouter.route('/')
    .post(validatorMiddleware(createAuthorValidator), createAuthor)
    .get(validatorMiddleware(getAuthorListValidator), getAuthorList)

authorRouter.route('/:id')
    .get(validatorMiddleware(getAuthorValidator), getAuthor)
    .patch(validatorMiddleware(updateAuthorValidator), updateAuthor)
    .delete(validatorMiddleware(deleteAuthorValidator), deleteAuthor)

export default authorRouter;