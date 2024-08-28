import path from "path";
import pug from "pug";
const Mailjet = require("node-mailjet");

export class Email {
  from: string;
  recipients: string;
  subject: string;
  constructor(recipients: string, subject: string) {
    this.from = process.env.MJ_SENDER_MAIL!;
    this.recipients = recipients;
    this.subject = subject;
  }

  async sendHtml(html: any, subject: string) {
    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );

    try {
      const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: this.from,
              Name: "AAPG MUK",
            },
            To: [
              {
                Email: this.recipients,
                Name: "User x",
              },
            ],
            Subject: subject,
            TextPart: "",
            HTMLPart: html,
          },
        ],
      });
      console.log("mail sent:", request);
    } catch (err: any) {
      console.log("Error sending mail:", err.statusCode);
    }
  }

  async sendWelcome(firstName: string) {
    const html = pug.renderFile(
      path.join(__dirname, "../views/email/welcome.pug"),
      {
        subject: this.subject,
        firstName: firstName,
      }
    );
    await this.sendHtml(html, "Welcome to AAPG MUK");
  }

  async sendPasswordReset(url: string, firstName: any) {
    const html = pug.renderFile(
      path.join(__dirname, "../views/email/resetPassword.pug"),
      {
        subject: "Password Reset",
        firstName: firstName,
        resetURL: url,
      }
    );
    await this.sendHtml(html, "Reset Password");
  }

  async sendContactUs(
    username: string,
    message: string,
    email: string,
    subject: string
  ) {
    const html = pug.renderFile(
      path.join(__dirname, "../views/email/contact.pug"),
      {
        subject: "Contact Us Message",
        username: username,
        message: message,
        email: email,
        contactSubject: subject,
      }
    );
    await this.sendHtml(html, "Contact Us Message");
  }

  async sendInitSignUpToken(token: number) {
    const html = pug.renderFile(
      path.join(__dirname, "../views/email/signupToken.pug"),
      {
        subject: "Initial Signup Token",
        token: token,
      }
    );
    await this.sendHtml(html, "Initial Signup Token");
  }

  async sendNewLetter(
    firstName: string,
    title: string,
    body: string,
    images: any[]
  ) {
    const html = pug.renderFile(
      path.join(__dirname, "../views/email/newsLetter.pug"),
      {
        subject: this.subject,
        firstName: firstName,
        title: title,
        body: title,
        images: images,
      }
    );
    await this.sendHtml(html, "Welcome to AAPG MUK");
  }
}
