class Mailer {
  async send({ _to, _subject, _html }) {
    throw new Error('Not implemented');
  }
}

module.exports = Mailer;
