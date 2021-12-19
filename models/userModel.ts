import bcrypt from "bcrypt";
import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import crypto from "crypto";

enum Role {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser extends Document {
  _id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  language?: string;
  job?: string;
  role?: Role;
  address?: string;
  whatBringsYouHere?: string;
  phone?: string;
  picture: string;
  activated: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    // username: {
    //   unique: true,
    //   trim: true,
    // },
    email: {
      type: String,
      trim: true,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    password: {
      type: String,
      trim: true,
      required: [true, "Please provide a password"],
      minlength: 4,
      select: false,
    },

    language: {
      type: String,
      default: "en",
    },

    job: {
      type: String,
    },
    phone: String,
    role: {
      type: String,
      default: Role.USER,
    },

    avatar: {
      type: String,
      default: "",
    },

    address: String,
    activated: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// hash the password before save into database
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// check if the password coming from the client is correct to the one in database
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};



userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
