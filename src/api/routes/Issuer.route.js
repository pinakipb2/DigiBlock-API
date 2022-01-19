const router = require('express').Router();
const bcrypt = require('bcrypt');
const Issuer = require('../models/issuer.model');

router.post('/validate-master-key', async (req, res, next) => {
  try {
    const { masterKey, masterKeyHash } = req.body;
    const status = await bcrypt.compare(masterKey, masterKeyHash);
    res.send({ status });
  } catch (err) {
    next(err);
  }
});

router.post('/add-issuer', async (req, res, next) => {
  try {
    const { orgName, address, docType } = req.body;
    const issuer = new Issuer({
      orgName,
      address,
      docType,
    });
    await issuer.save();
    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
});

router.get('/all-issuers', async (req, res, next) => {
  try {
    const allIssuers = await Issuer.find({});
    res.send(allIssuers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
