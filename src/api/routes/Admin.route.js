const router = require('express').Router();
const bcrypt = require('bcrypt');
const path = require('path');
const genMasterKey = require('../controllers/genMasterKey');
const Admin = require('../models/admin.model');
const sendMasterKeyMail = require('../controllers/sendMasterKeyMail');

router.post('/gen-master-key', async (req, res, next) => {
  try {
    const masterKey = genMasterKey();
    console.log(req.body);
    const { name, address, email } = req.body;
    const replacements = {
      username: name,
      masterKey,
    };
    const maillist = [email];
    const subject = 'Master key 🔑';
    const text = 'Thanks for Registering with DigiBlock.';
    sendMasterKeyMail(path.join(__dirname, '../../assets/static/masterKey.html'), replacements, maillist, subject, text);
    const admin = new Admin({
      name,
      address,
    });
    await admin.save();
    const salt = await bcrypt.genSalt(11);
    const hashedMasterKey = await bcrypt.hash(masterKey, salt);
    res.send({ masterKey: hashedMasterKey });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
