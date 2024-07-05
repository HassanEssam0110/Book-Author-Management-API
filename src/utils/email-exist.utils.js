import { User } from '../../database/models/user.model.js';
import { catchError } from './../middlewares/error/catch-error.middleware.js';
import { ApiError } from './api-error.utils.js';

export const isEmailExists = catchError(async (req, res, next) => {
    const { email } = req.body;
    const isExists = await User.findOne({ email });
    if (isExists) {
        return next(new ApiError('This email is already exists.', 409))
    }
    next();
})