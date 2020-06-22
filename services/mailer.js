const keys = require("../config/keys");
const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: keys.SMTP_HOST,
    port: keys.SMTP_PORT,
    secure: keys.SMTP_SSL, // upgrade later with STARTTLS
    auth: {
      user: keys.SMTP_USER,
      pass: keys.SMTP_PASS
    }
});