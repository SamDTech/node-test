import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import asyncHandler from "express-async-handler";
import AppError from "../utils/appError";
import User, { IUser } from "../models/userModel";
import { Email } from "../utils/email";
import dayjs from "dayjs";
const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.GOOGLE_CLIENT_ID!);

interface IRegister {
  email: string;
  password: string;
  language?: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
      };
    }
  }
}

// Generate token function
const signToken = (id: string) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

// createActivationToken
const createActivationToken = (payload: {
  email: string;
  language: string;
}): string => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET!, {
    expiresIn: "30m",
  });
};

// signup controller
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, language } = req.body;

    // check if user exist
    const user = await User.findOne({ email });

    if (user) {
      return next(new AppError(400, "This email already exist"));
    }

    const newUser = { email, language };

    //generate activationToken
    const activationToken = createActivationToken(newUser);

    //create url to be included in the mail for activation
    const url = `${process.env.CLIENT_URL}/user/activate/${activationToken}/register`;

    // create a new user
    await User.create({ email, password, language });

    // invoke the activation email
    await new Email(newUser, url).sendActivationCode();

    res
      .status(200)
      .json({ msg: "Register Success! Please activate your email to start" });
  }
);

// re-send activation code controller
export const resendActivation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, language } = req.body;

    // check if user exist
    const user = await User.findOne({ email, activated: false });

    if (!user) {
      return next(new AppError(400, "This email already exist, Please login"));
    }

    const newUser = { email, language };

    //generate activationToken
    const activationToken = createActivationToken(newUser);

    //create url to be included in the mail for activation
    const url = `${process.env.CLIENT_URL}/user/activate/${activationToken}/register`;

    // invoke the activation email
    await new Email(newUser, url).sendActivationCode();

    res.status(200).json({
      msg: "Activation link resent! Please activate your email to start",
    });
  }
);

// activate-account controller
export const activateAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      activationToken,
      firstName,
      lastName,
      job,
      whatBringsYouHere,
      phone,
      company,
      size,
      industry,
      crm,
    } = req.body;

    // let user: IRegister;

    if (!activationToken) {
      return next(new AppError(400, "Activation token is required"));
    }

    const user = jwt.verify(
      activationToken,
      process.env.ACTIVATION_TOKEN_SECRET!
    ) as IRegister;

    if (!user) {
      return next(new AppError(400, "invalid activation token"));
    }
    const { email } = user;
    const checkUser = await User.findOne({ email, activated: false });

    if (!checkUser) {
      return next(new AppError(400, "user not found or account not activated"));
    }

    checkUser.firstName = firstName;
    checkUser.lastName = lastName;
    checkUser.job = job;
    checkUser.whatBringsYouHere = whatBringsYouHere;
    checkUser.phone = phone;
    checkUser.activated = true;



     await checkUser.save();



    // create jwt
    const token = signToken(checkUser._id!);

    // invoke the activation email
    await new Email(checkUser, process.env.CLIENT_URL!).sendWelcome();

    res.cookie("token", token, {
      httpOnly: false,
      expires: dayjs().add(30, "minute").toDate(),
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ msg: "Account successfully activated" });
  }
);


// login controller
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(400, "Invalid Credentials"));
  }

  // check if user is activated
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError(400, "Invalid Credentials"));
  }

  if (user && !user.activated) {
    return next(new AppError(422, "Account awaiting activation"));
  }

  const match = await bcrypt.compare(password, user.password!);

  if (!user || !match) {
    return next(new AppError(400, "Invalid Credentials"));
  }

  // create jwt
  const token = signToken(user?._id!);

  res.cookie("token", token, {
    httpOnly: false,
    expires: dayjs().add(30, "minute").toDate(),
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });

  const {
    firstName: fn,
    lastName: ln,
    email: em,
    language: la,
    job: jb,
    whatBringsYouHere: wbyh,
    phone: ph,
    role,
    picture,
    _id,
    createdAt,
    updatedAt,
  } = user;

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
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("token");

    res.status(200).json({ msg: "Signout success" });
  }
);

export const currentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = await User.findById(req?.user.id);

    if (!user || !user.activated) {
      return next(new AppError(403, "UnAuthorized"));
    }

    res.status(200).json(user);
  }
);

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError(400, "Invalid Email"));
  }
  const user = await User.findOne({ email, activated: true });
  if (!user || !user._id) {
    return next(new AppError(404, "email not found"));
  }

  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "10m",
  });
  const url = `${process.env.CLIENT_URL!}/user/reset/${access_token}/password`;

  await new Email(user, url).sendPasswordReset();
  res
    .status(200)
    .json({ msg: "Re-send the password, please check your email." });
});

export const resetPassword = asyncHandler(async (req: Request, res, next) => {
  const { newPassword, passwordConfirm, token } = req.body;

  if (newPassword !== passwordConfirm) {
    return next(new AppError(400, "password does not match"));
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

  const user = await User.findById(payload.id).select("+password");

  if (!user) {
    return next(new AppError(400, "user not found"));
  }

  user.password = newPassword;

  const newP = await user.save();

  res.status(200).json({ msg: "password changed successfully" });
});


export const updatePassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from collection
  const { newPassword, passwordConfirm } = req.body;
  const user = await User.findById(req.user?.id).select("+password");

  if (!user) {
    return next(new AppError(400, "user not found"));
  }

  // 2) check if posted current password is correct
  if (!newPassword || newPassword !== passwordConfirm || newPassword < 5) {
    return next(new AppError(400, "invalid password format"));
  }
  // 3) If so, update password
  user.password = req.body.password;
  await user.save();
  // 4)log in user, send jwt
  // create jwt
  const token = signToken(user?._id!);

  res.cookie("token", token, {
    httpOnly: false,
    expires: dayjs().add(30, "minute").toDate(),
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });

  const {
    firstName: fn,
    lastName: ln,
    email: em,
    language: la,
    job: jb,
    whatBringsYouHere: wbyh,
    phone: ph,
    role,
    picture,
    _id,
    createdAt,
    updatedAt,
  } = user;

  res.status(201).json({
    msg: "password successfully changed!",
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

