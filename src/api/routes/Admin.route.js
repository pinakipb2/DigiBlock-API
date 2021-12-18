const router = require('express').Router();
const bcrypt = require('bcrypt');
const genMasterKey = require('../controllers/genMasterKey');
const Admin = require('../models/admin.model');

router.post('/gen-master-key', async (req, res, next) => {
  try {
    const masterKey = genMasterKey();
    console.log(req.body);
    const { name, address, email } = req.body;
    // sendMail(email, masterKey);
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
