import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {  v2 as cloudinary } from "cloudinary";
import User, { IUser } from "../models/userModel";
import AppError from "../utils/appError";


export const userPhotoUpload = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.body; // get the user photo as base64 string
    console.log(avatar);

    const upload = await cloudinary.uploader.upload(avatar, {
      folder: "user-avatars",
      resource_type: "image",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        avatar: upload.secure_url,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedUser);
  }
);


// @desc Update user profile

// @route Patch /api/v1/users/updateMe

// @access Private
export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs Password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError(400, "This route is not for password Update"));
    }
    // 3) Filtered out unwanted fields names that are not allowed to be updated
    const { password, avatar, role, email, ...rest } = req.body;
    // 2)Update User document

    const updatedUser = await User.findByIdAndUpdate(
      {
        _id: req.user?.id,
      },
      rest,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedUser);
  }
);

// delete user
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndDelete(req.user?.id);
    res.status(200).json({
      status: "success",
      message: "User deleted",
    });
  }
);


