const router = require('express').Router();
const bcrypt = require('bcrypt');

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
