import authRouter from "../modules/auth/auth.routes.js"
import authorRouter from "../modules/author/author.routes.js"
import bookRouter from "../modules/book/book.routes.js"

/**
 * Mounts the route handlers to the Express application.
 *
 * @param {import('express').Express} app - The Express application instance.
 */
export const mountRotes = (app) => {
    app.use('/auth', authRouter)
    app.use('/authors', authorRouter)
    app.use('/books', bookRouter)
}