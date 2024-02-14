import path from "path";
import pug from "pug";
const SGmail = require("@sendgrid/mail");

export class Email {
  from: string;
  recipients: string;
  subject: string;
  constructor(recipients: string, subject: string) {
    SGmail.setApiKey(process.env.SENDGRID_API_KEY);

    this.from = process.env.SENDER_EMAIL!;
    this.recipients = recipients;
    this.subject = subject;
  }

  async sendHtml(html: any, subject: string) {
    const mailOptions = {
      to: this.recipients,
      from: { email: this.from, name: "SEG MUK" },
      subject: subject,
      html: html,
    };
    try {
      console.log("sending mail");
      await SGmail.send(mailOptions);
      console.log("mail sent");
    } catch (error) {
      console.log("error sending email", error);
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
    await this.sendHtml(html, "Welcome to SEG MUK");
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
    await this.sendHtml(html, "Welcome to SEG MUK");
  }
}
