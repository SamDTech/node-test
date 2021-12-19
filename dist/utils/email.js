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
exports.Email = void 0;
const { convert } = require("html-to-text");
const pug = __importStar(require("pug"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// new Email(user, url).sendEmail()
mail_1.default.setApiKey(process.env.SENDGRID_PASSWORD);
class Email {
    constructor(user, url) {
        this.user = user;
        this.url = url;
        this.to = user.email;
        this.firstName = user.firstName;
        this.lastName = user.firstName;
        this.url = url;
        this.from = `Maxime <${process.env.EMAIL_FROM}>`;
    }
    // newTransport() {
    //   return nodemailer.createTransport({
    //     host: process.env.SENDINBLUE_SMTP_HOST!,
    //     port: process.env.SENDINBLUE_SMTP_PORT,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //       user: process.env.SENDINBLUE_SMTP_USER,
    //       pass: process.env.SENDINBLUE_SMTP_PASSWORD,
    //     },
    //   } as TransportOptions);
    // }
    // Send the actual email
    async send(template, subject) {
        const filePath = path.join(__dirname, `./views/emails/${template}.pug`);
        const source = fs.readFileSync(filePath, "utf-8").toString();
        // 1) RENDER html
        const html = pug.renderFile(filePath, {
            url: this.url,
            subject,
            firstName: this.firstName
        });
        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: [this.to],
            subject,
            html,
            text: convert(html),
            //html:
        };
        // 3) create a transport and send email
        try {
            await mail_1.default.send(mailOptions);
            console.log("email sent...");
        }
        catch (err) {
            //@ts-ignore
            console.log(err.message);
        }
    }
    async sendWelcome() {
        await this.send("welcome", "welcome to the learning family!");
    }
    async sendPasswordReset() {
        await this.send("passwordReset", "Your password Reset token (Valid for only 10mins)");
    }
    async sendActivationCode() {
        await this.send("accountActivate", "Juridoc  Activate Your Account");
        console.log("mail sent");
    }
}
exports.Email = Email;
