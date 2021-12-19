import nodemailer, { TransportOptions } from "nodemailer";
const { convert } = require("html-to-text");
import * as pug from "pug";
import sgMail from "@sendgrid/mail";
import * as fs from "fs";
import * as path from "path";

// new Email(user, url).sendEmail()

sgMail.setApiKey(process.env.SENDGRID_PASSWORD!);

export class Email {
  private to: string;
  private firstName: string;
  private lastName: string;
  private from: string;
  constructor(private user: any, private url: string) {
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
  async send(template: any, subject: string) {
    const filePath = path.join(__dirname, `./views/emails/${template}.pug`);
    const source = fs.readFileSync(filePath, "utf-8").toString();

    // 1) RENDER html
    const html = pug.renderFile(filePath, {
      url: this.url,
      subject,
      firstName: this.firstName,
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
      await sgMail.send(mailOptions);
      console.log("email sent...");
    } catch (err) {
      //@ts-ignore
      console.log(err.message);
    }
  }

  async sendWelcome() {
    await this.send("welcome", "welcome to the learning family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password Reset token (Valid for only 10mins)"
    );
  }

  async sendActivationCode() {
    await this.send("accountActivate", "Juridoc  Activate Your Account");

    console.log("mail sent");
  }

  async sendInviteLink() {
    await this.send("inviteTeam", "Juridoc  You are Invited to Join");

    console.log("mail sent");
  }
}
