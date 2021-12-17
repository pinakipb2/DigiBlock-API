const router = require('express').Router();
const nanoid = require('../controllers/genMasterKey');

router.post('/gen-master-key', async (req, res, next) => {
  const masterKey = nanoid();
  console.log(req.body);
  res.send({ masterKey });
});

module.exports = router;
