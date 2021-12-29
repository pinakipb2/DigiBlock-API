const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

module.exports = async function sendMasterKeyMail(filePath, replacements, maillist, subject, text) {
  await fs.readFile(filePath, { encoding: 'utf-8' }, async (err, html) => {
    if (err) {
      throw err;
    } else {
      const transport = nodemailer.createTransport(sgTransport({
        auth: {
          api_key: process.env.SENDGRID_API,
        },
      }));
      const template = handlebars.compile(html);
      const htmlToSend = template(replacements);
      const mailOptions = {
        from: process.env.GMAIL,
        to: maillist,
        subject,
        text,
        attachments: [{
          filename: 'digiBlock.png',
          path: path.join(__dirname, '../../assets/images/digiBlock.png'),
          cid: 'logo',
        }],
        html: htmlToSend,
      };
      await transport.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.log(error);
          throw error;
        }
      });
    }
  });
};
