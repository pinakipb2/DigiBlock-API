const router = require('express').Router();
const bcrypt = require('bcrypt');
const path = require('path');
const genMasterKey = require('../controllers/genMasterKey');
const Admin = require('../models/admin.model');
const sendMasterKeyMail = require('../controllers/sendMasterKeyMail');
const { encrypt, decrypt } = require('../controllers/encryptDecrypt');

router.post('/gen-master-key', async (req, res, next) => {
  try {
    const masterKey = genMasterKey();
    // console.log(masterKey);
    const encMasterKey = encrypt(process.env.MASTER_KEY_SECRET, masterKey);
    if (encMasterKey.status === 0) {
      throw encMasterKey.data;
    }
    const salt = await bcrypt.genSalt(11);
    const hashedMasterKey = await bcrypt.hash(masterKey, salt);
    res.send({ masterKey: encMasterKey.data, hashedMasterKey });
  } catch (err) {
    next(err);
  }
});

router.post('/send-master-key', async (req, res, next) => {
  try {
    // console.log(req.body);
    const {
      name, address, email, masterKey,
    } = req.body;
    const decMasterKey = decrypt(process.env.MASTER_KEY_SECRET, masterKey);
    if (decMasterKey.status === 0) {
      throw decMasterKey.data;
    }
    // console.log(`Received Master Key : ${decMasterKey.data}`);

    const admin = new Admin({
      name,
      address,
      isVerified: true,
    });
    await admin.save();

    const text = 'Thank You for Associating as an Admin with DigiBlock.';
    const replacements = {
      name,
      masterKey: decMasterKey.data,
      text,
    };
    const maillist = [email];
    const subject = 'Master key 🔑';
    sendMasterKeyMail(path.join(__dirname, '../../assets/static/masterKey.html'), replacements, maillist, subject, text);

    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
});

router.post('/validate-master-key', async (req, res, next) => {
  try {
    const { masterKey, masterKeyHash } = req.body;
    const status = await bcrypt.compare(masterKey, masterKeyHash);
    res.send({ status });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
