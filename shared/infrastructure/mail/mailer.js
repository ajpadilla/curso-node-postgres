class Mailer {
  async send({ to, subject, html }) {
    throw new Error('Not implemented');
  }
}

module.exports = Mailer;
