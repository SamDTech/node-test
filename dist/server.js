"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const colors_1 = __importDefault(require("colors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const db_1 = __importDefault(require("./config/db"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const authRoute_1 = require("./routes/authRoute");
//import cloudinaryConfig from "./utils/cloudinary";
const app = (0, express_1.default)();
// configure colors
colors_1.default.enable();
app.use((0, cors_1.default)({ origin: "*" }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
dotenv_1.default.config();
// configure swagger
const swaggerJSDocs = yamljs_1.default.load('./api.yaml');
// connect to DB
(0, db_1.default)();
// configure cloudinary
//cloudinaryConfig();
// MIDDLEWARES
app.use(express_1.default.json());
//app.use(urlencoded({extended: true}))
// configure swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerJSDocs));
const PORT = process.env.PORT || 8000;
// Mount Routes
//app.use("/api/files", fileRoute);
app.use('/api/v2/auth', authRoute_1.authRouter);
//global Error Handler
app.use(errorHandler_1.default);
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`.underline.cyan.bold));
