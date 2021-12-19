import expressJwt from "express-jwt";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

// interface IRequest extends Request {
//   cookies: string
// }

export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    if (!req.cookies || !req.cookies.token) {
      return null;
    }

    return req.cookies.token;
  },
});
