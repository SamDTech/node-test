"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSignin = void 0;
const express_jwt_1 = __importDefault(require("express-jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// interface IRequest extends Request {
//   cookies: string
// }
exports.requireSignin = (0, express_jwt_1.default)({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    getToken: (req) => {
        if (!req.cookies || !req.cookies.token) {
            return null;
        }
        return req.cookies.token;
    },
});
