"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.currentUser = exports.logout = exports.login = exports.activateAccount = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleapis_1 = require("googleapis");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const appError_1 = __importDefault(require("../utils/appError"));
const userModel_1 = __importDefault(require("../models/userModel"));
const email_1 = require("../utils/email");
const companyModel_1 = __importDefault(require("../models/companyModel"));
const { OAuth2 } = googleapis_1.google.auth;
const client = new OAuth2(process.env.GOOGLE_CLIENT_ID);
// Generate token function
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({
        id,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
// createActivationToken
const createActivationToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "5m",
    });
};
// signup controller
exports.register = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password, language } = req.body;
    // check if user exist
    const user = await userModel_1.default.findOne({ email });
    if (user) {
        return next(new appError_1.default(400, "This email already exist"));
    }
    const newUser = { email, password, language };
    //generate activationToken
    const activationToken = createActivationToken(newUser);
    //create url to be included in the mail for activation
    const url = `${process.env.CLIENT_URL}/user/activate/${activationToken}`;
    // invoke the activation email
    await new email_1.Email(newUser, url).sendActivationCode();
    res
        .status(200)
        .json({ msg: "Register Success! Please activate your email to start" });
});
// activate-account controller
exports.activateAccount = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { activation_token, firstName, lastName, job, whatBringsYouHere, phone, company, size, industry, CRM, } = req.body;
    const user = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);
    const { email, password, language } = user;
    const check = await userModel_1.default.findOne({ email });
    if (check) {
        return next(new appError_1.default(400, "This email already exists."));
    }
    const newUser = (await userModel_1.default.create({
        email,
        password,
        language,
        firstName,
        lastName,
        job,
        whatBringsYouHere,
        phone,
    }));
    // create company
    const newCompany = await companyModel_1.default.create({
        companyName: company,
        size,
        industry,
        CRM,
        user: newUser._id,
    });
    // create jwt
    const token = signToken(newUser === null || newUser === void 0 ? void 0 : newUser._id);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    const { firstName: fn, lastName: ln, email: em, language: la, job: jb, whatBringsYouHere: wbyh, phone: ph, role, picture, _id, createdAt, updatedAt, } = newUser;
    res.status(201).json({
        msg: "Account has been activated!",
        _id,
        firstName: fn,
        lastName: ln,
        email: em,
        language: la,
        job: jb,
        whatBringsYouHere: wbyh,
        phone: ph,
        role,
        picture,
        createdAt,
        updatedAt,
    });
});
// login controller
exports.login = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default(400, "Invalid Credentials"));
    }
    const user = await userModel_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new appError_1.default(400, "Invalid Credentials"));
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!user || !match) {
        return next(new appError_1.default(400, "Invalid Credentials"));
    }
    // create jwt
    const token = signToken(user === null || user === void 0 ? void 0 : user._id);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    const { firstName: fn, lastName: ln, email: em, language: la, job: jb, whatBringsYouHere: wbyh, phone: ph, role, picture, _id, createdAt, updatedAt, } = user;
    res.status(200).json({
        _id,
        firstName: fn,
        lastName: ln,
        email: em,
        language: la,
        job: jb,
        whatBringsYouHere: wbyh,
        phone: ph,
        role,
        picture,
        createdAt,
        updatedAt,
    });
});
// logout
exports.logout = (0, express_async_handler_1.default)(async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({ msg: "Signout success" });
});
exports.currentUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    // @ts-ignore
    const user = await userModel_1.default.findById(req === null || req === void 0 ? void 0 : req.user.id);
    if (!user) {
        return next(new appError_1.default(403, "UnAuthorized"));
    }
    res.status(200).json(user);
});
// Grant Access to specific roles
exports.authorize = (...roles) => {
    //   return (req: Request, res: Response, next: NextFunction) => {
    //     if (!roles.includes(req.user.role)) {
    //       return next(
    //         new AppError(
    //           `User role ${req.user.role} is not authorized to access this route`,
    //           403
    //         )
    //       );
    //     }
    //     next();
    //   };
};
exports.forgotPassword = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new appError_1.default(400, "Invalid Email"));
    }
    const user = await userModel_1.default.findOne({ email });
    if (!user || !user._id) {
        return next(new appError_1.default(404, "email not found"));
    }
    const access_token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
    });
    const url = `${process.env.CLIENT_URL}/user/reset/${access_token}`;
    await new email_1.Email(user, url).sendPasswordReset();
    res
        .status(200)
        .json({ msg: "Re-send the password, please check your email." });
});
exports.resetPassword = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { newPassword, passwordConfirm, token } = req.body;
    if (newPassword !== passwordConfirm) {
        return next(new appError_1.default(400, "password does not match"));
    }
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await userModel_1.default.findById(payload.id).select("+password");
    if (!user) {
        return next(new appError_1.default(400, "user not found"));
    }
    user.password = newPassword;
    const newP = await user.save();
    res.status(200).json({ msg: "password changed successfully" });
});
// export const googleLogin = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//      const { tokenId } = req.body;
//      const verify = await client.verifyIdToken({
//        idToken: tokenId,
//        audience: process.env.GOOGLE_CLIENT_ID!,
//      });
//      //@ts-ignore
//     const { email_verified, email, name, picture } = verify.payload
//      const password = email + process.env.GOOGLE_PASSWORD_SECRET!;
//   //   const passwordHash = await bcrypt.hash(password, 12);
//      if (!email_verified){
//        return next(new AppError(400, "Email verification failed."));
//      }
//      const user = await User.findOne({ email }).select('+password');
//     if (user) {
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch)
//         return next(new AppError(400, "Email verification failed."));
//       // create jwt
//       const token = signToken(user?._id!);
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//       });
//       const {
//         firstName: fn,
//         lastName: ln,
//         email: em,
//         language: la,
//         job: jb,
//         whatBringsYouHere: wbyh,
//         phone: ph,
//         role,
//         picture,
//         _id,
//         createdAt,
//         updatedAt,
//       } = user;
//       res.status(200).json({
//         _id,
//         firstName: fn,
//         lastName: ln,
//         email: em,
//         language: la,
//         job: jb,
//         whatBringsYouHere: wbyh,
//         phone: ph,
//         role,
//         picture,
//         createdAt,
//         updatedAt,
//       });
//     }
//     else {
//       //@ts-ignore
//   const {picture } = verify.payload
//       const newUser = new User({
//         firstName: name,
//         email,
//         password,
//         picture,
//       });
//    const user =  await newUser.save();
//       // create jwt
//       const token = signToken(user?._id!);
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//       });
//       const {
//         firstName: fn,
//         lastName: ln,
//         email: em,
//         language: la,
//         job: jb,
//         whatBringsYouHere: wbyh,
//         phone: ph,
//         role,
//         picture,
//         _id,
//         createdAt,
//         updatedAt,
//       } = user;
//       res.status(200).json({
//         _id,
//         firstName: fn,
//         lastName: ln,
//         email: em,
//         language: la,
//         job: jb,
//         whatBringsYouHere: wbyh,
//         phone: ph,
//         role,
//         picture,
//         createdAt,
//         updatedAt,
//       });
//     }
//   }
// );
