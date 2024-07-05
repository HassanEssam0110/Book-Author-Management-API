//@desc   Handle Exceptioms in code  ex: SyntaxError
process.on('uncaughtException', (err) => {
    console.error(`uncaughtException Error:   ErrorName:${err.name}  |  ErrorMessage:${err.message}`);
});

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';

import { db_connect } from './database/connection.js';
import { globalError } from './src/middlewares/error/global-error-handler.middleware.js';
import { ApiError } from './src/utils/api-error.utils.js';
import { mountRotes } from './src/utils/mount-routes.utils.js';

// Load environment variables from config.env
dotenv.config({ path: path.resolve('config.env') });

const app = express();
db_connect();

app.use(express.json({ limit: '25kb' })); // parse && request size limits
app.use(morgan('dev'));

app.get('/', (req, res, next) => { res.send('Here we go ==>') });

// Mount Routers
mountRotes(app);


// Middleware Route NOT FOUND Error handler
app.use('*', (req, res, next) => {
    return next(new ApiError(`route not found ${'url: ' + req.protocol + '://' + req.get('host') + req.originalUrl}`, 404))
})

// Middleware Global Error handler for express
app.use(globalError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => { console.log(`Mode:${process.env.NODE_ENV} && listening on PORT: ${PORT}`) });

//@desc   Handle rejection outside express ex: database
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection Error:   ErrorName:${err.name}  |  ErrorMessage:${err.message}`);
    server.close(() => {
        console.error(`Shutting down...`);
        process.exit(1);
    })
});
