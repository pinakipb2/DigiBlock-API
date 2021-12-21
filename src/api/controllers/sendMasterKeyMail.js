const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = async function sendMasterKeyMail(filePath, replacements, maillist, subject, text) {
  await fs.readFile(filePath, { encoding: 'utf-8' }, async (err, html) => {
    if (err) {
      throw err;
    } else {
      const accessToken = await oAuth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken,
        },
      });
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
