const nodemailer = require('nodemailer');
const Mailer = require("../../../shared/infrastructure/mail/mailer");

class NodemailerMailer extends Mailer {
  constructor(config) {
    super();
    this.transporter = nodemailer.createTransport(config);
  }

  async send({ to, subject, html }) {
    await this.transporter.sendMail({
      to,
      subject,
      html,
    });
  }
}

module.exports = NodemailerMailer;
