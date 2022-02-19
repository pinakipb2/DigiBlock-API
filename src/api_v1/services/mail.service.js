import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

const sendMasterKeyMail = async (filePath, replacements, maillist, subject, text) => {
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const transport = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_API,
        },
      })
    );
    const template = handlebars.compile(html);
    const htmlToSend = template(replacements);
    const mailOptions = {
      from: process.env.GMAIL,
      to: maillist,
      subject,
      text,
      attachments: [
        {
          filename: 'digiBlock.png',
          path: path.join(__dirname, '../../assets/images/digiBlock.png'),
          cid: 'logo',
        },
      ],
      html: htmlToSend,
    };
    return transport.sendMail(mailOptions);
  }
  throw new Error('File Not Found');
};

export default sendMasterKeyMail;
