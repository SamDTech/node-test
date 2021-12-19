"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const colors_1 = __importDefault(require("colors"));
dotenv_1.default.config();
colors_1.default.enable();
const connectDB = async () => {
    console.log(process.env.MONGO_URI);
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, {
        //    useCreateIndex: true,
        //    useFindAndModify: false,
        //    useUnifiedTopology: true,
        //    useNewUrlParser: true,
        });
        console.log("DB Connected".green.bold);
    }
    catch (error) {
        console.log("Error Connection DB".red.bold, error);
    }
};
exports.default = connectDB;
