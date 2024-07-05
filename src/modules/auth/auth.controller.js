import bcrypt from 'bcryptjs'

import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middlewares/error/catch-error.middleware.js";
import { ApiError } from "../../utils/api-error.utils.js";
import { generateOTP, sentOTP } from "../../utils/otp.utils.js";
import { sanitizeUser } from "../../utils/sanitize-data.utils.js";
import { sendResponse } from "../../utils/send-response.utils.js";
import { generateToken } from './../../utils/token.utils.js';
import { MsgHTML } from '../../utils/mail-html.utils.js';
import { sendMails } from '../../services/mail.service.js';



// signup and send OTP 
export const signup = catchError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const hashPassword = bcrypt.hashSync(password, +process.env.BCRYPT_SALT);

    // 1- create  inctence from user.
    const user = await User({ name, email, password: hashPassword });

    // 2- generate OTP
    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    // 3- send confirmation email
    const isEmailSent = await sentOTP({
        to: user.email,
        subject: "Welcome to Book Author App - Verify your email address",
        otp,
        userName: user.name,
        textmessage: 'Thank you for choosing our App. Please use the following OTP to complete your sign-up process. The OTP is valid for 10 minutes.',
    });

    if (isEmailSent?.rejected.length) {
        return next(new ApiError('send verification Email is faild', 500))
    };

    // 4- save user in DB
    const newUser = await user.save();
    return sendResponse(res, { data: { user: sanitizeUser(newUser) } }, 201)
});

export const signin = catchError(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new ApiError('Incorrect email or password', 401));
    }

    // Generate token for authenticated user
    const token = generateToken(
        { userId: user._id, role: user.role }
        , process.env.JWT_SECRET_KEY
        , process.env.JWT_EXPIRE_TIME);

    return sendResponse(res, { data: sanitizeUser(user), token });
})

export const verifyEmail = catchError(async (req, res, next) => {
    const { virifyCode } = req.body;
    const user = await User.findOne({ otpCode: virifyCode, isConfirmed: false });
    if (!user) {
        return next(new ApiError('Invalid OTP code', 400))
    }
    // check if OTP expired
    const currentTimeAimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    const otpExpireAimestamp = Math.floor(user.otpExpire.getTime() / 1000); // OTP expiration time in seconds
    if (currentTimeAimestamp > otpExpireAimestamp) {
        return next(new ApiError('The OTP has expired', 400))
    }
    user.isConfirmed = true;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    await user.save();
    return sendResponse(res, { message: 'confirmed', data: sanitizeUser(user) });
});

export const resendVerificationCode = catchError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email, isConfirmed: false });
    if (!user) {
        return next(new ApiError('Invalid email or user already confirmed', 400))
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const isEmailSent = await sentOTP({
        to: user.email,
        subject: "Welcome to Book Author App - resend your verification code",
        otp,
        userName: user.name,
        textmessage: 'Thank you for choosing our App. Please use the following OTP to complete your sign-up process. The OTP is valid for 10 minutes.',
    });

    if (isEmailSent?.rejected.length) {
        return next(new ApiError('send verification Email is faild', 500))
    };

    await user.save();
    return sendResponse(res, { message: 'Verification code resent successfully' });
});

export const getLoggedUser = catchError(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);
    return sendResponse(res, { data: sanitizeUser(user) });
})

export const changePassword = catchError(async (req, res, next) => {
    const { password, newPassword } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);

    // 1- Check if user password is correct
    if (!bcrypt.compareSync(password, user.password)) {
        return next(new ApiError('Incorrect password', 403));
    }
    // 2- hash new password
    const hashPassword = bcrypt.hashSync(newPassword, +process.env.BCRYPT_SALT);

    // 3- send email to user
    const isEmailSent = await sendMails({
        to: user.email,
        subject: "Book Author App - change password",
        html: MsgHTML(user.name, 'Your password has been changed successfully.')
    });


    if (isEmailSent?.rejected.length) {
        return next(new ApiError('send change passwoed Email is faild', 500))
    };

    // 4- save updated password
    user.password = hashPassword;
    user.passwordChangedAt = new Date();
    await user.save();
    return sendResponse(res, { message: 'password changed successfully, please login again.' });
})