import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import errorMiddleware from "./middlewares/errorHandler";
import { authRouter } from "./routes/authRoute";

import cloudinaryConfig from "./utils/cloudinary";

const app = express();

import { userRouter } from "./routes/userRoute";
// configure colors

colors.enable();

// Add a list of allowed origins.

const allowedOrigins = [

  "http://localhost:8080",

  "http://localhost:3000",
];

const options: cors.CorsOptions = {
  credentials: true,
  origin: allowedOrigins,
};

// Then pass these options to cors:
app.use(cors(options));

// MIDDLEWARES

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
dotenv.config();



// connect to DB
connectDB();

// configure cloudinary
cloudinaryConfig();

//app.use(urlencoded({extended: true}))


const PORT = process.env.PORT || 8000;

// Mount Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);



//global Error Handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}`.underline.cyan.bold);
});
