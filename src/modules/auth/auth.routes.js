import { Router } from "express";
import { changePassword, getLoggedUser, resendVerificationCode, signin, signup, verifyEmail } from "./auth.controller.js";
import { changePasswordValidator, resendCodeValudator, signinValidator, signupValidator, virfiyEmailValudator } from "./auth.valudation.js";
import { validatorMiddleware } from "../../middlewares/validation.middleware.js";
import { isEmailExists } from "../../utils/email-exist.utils.js";
import { auth } from "../../middlewares/auth.middleware.js";


const authRouter = Router();

authRouter.post('/signup', validatorMiddleware(signupValidator), isEmailExists, signup)
authRouter.put('/verify-email', validatorMiddleware(virfiyEmailValudator), verifyEmail)
authRouter.post('/resend-verification-code', validatorMiddleware(resendCodeValudator), resendVerificationCode)
authRouter.post('/signin', validatorMiddleware(signinValidator), signin)
authRouter.get('/logged-user', auth, getLoggedUser)
authRouter.patch('/change-password', auth, validatorMiddleware(changePasswordValidator), changePassword)

export default authRouter;