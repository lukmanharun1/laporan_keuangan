const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    const { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD } = process.env;

    const transport = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });

    transport.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".html",
          partialsDir: path.resolve("./templates/email"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./templates/email"),
        extName: ".html",
      })
    );
    const mailOptions = {
      from: `"Saham Syariah App 👻" <${MAIL_USERNAME}>`,
      to: data.to,
      subject: data.subject,
      template: data.template,
      context: data.data,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};
