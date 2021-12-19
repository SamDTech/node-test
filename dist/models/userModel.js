"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const crypto_1 = __importDefault(require("crypto"));
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
})(Role || (Role = {}));
const userSchema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
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
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
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
    whatBringsYouHere: String,
    phone: String,
    role: {
        type: String,
        default: Role.USER,
    },
    picture: {
        type: String,
        default: "",
    },
    address: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, { timestamps: true });
// hash the password before save into database
userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password"))
        return next();
    // Hash the password with cost of 12
    this.password = await bcrypt_1.default.hash(this.password, 12);
    next();
});
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew)
        return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
// check if the password coming from the client is correct to the one in database
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt_1.default.compare(candidatePassword, userPassword);
};
// // method to check if the user changed password
// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changeTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     console.log(changeTimestamp, JWTTimestamp);
//     return JWTTimestamp < changeTimestamp;
//   }
//   // false means Not changed
//   return false;
// };
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({ resetToken }, this.passwordResetToken);
    return resetToken;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
