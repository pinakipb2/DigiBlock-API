import express from 'express';
import { adminController } from '../controllers';

const router = express.Router();
// const path = require('path');
// const Admin = require('../models/admin.model');
// const sendMasterKeyMail = require('../controllers/sendMasterKeyMail');

router.get('/generate-master-key', adminController.generateMasterKey);

// router.post('/gen-issuer-master-key', async (req, res, next) => {
//   try {
//     const masterKey = genMasterKey();
//     const encMasterKey = encrypt(process.env.ISSUER_MASTER_KEY_SECRET, masterKey);
//     if (encMasterKey.status === 0) {
//       throw encMasterKey.data;
//     }
//     const salt = await bcrypt.genSalt(11);
//     const hashedMasterKey = await bcrypt.hash(masterKey, salt);
//     res.send({ masterKey: encMasterKey.data, hashedMasterKey });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/send-master-key', async (req, res, next) => {
//   try {
//     const { name, address, email, masterKey } = req.body;
//     const decMasterKey = decrypt(process.env.ADMIN_MASTER_KEY_SECRET, masterKey);
//     if (decMasterKey.status === 0) {
//       throw decMasterKey.data;
//     }
//     const admin = new Admin({
//       name,
//       address,
//     });
//     await admin.save();
//     const text = 'Thank You for Associating as an Admin with DigiBlock.';
//     const replacements = {
//       name,
//       masterKey: decMasterKey.data,
//       text,
//     };
//     const maillist = [email];
//     const subject = 'Admin Master key 🔑';
//     sendMasterKeyMail(path.join(__dirname, '../../assets/static/masterKey.html'), replacements, maillist, subject, text);
//     res.status(200).send('OK');
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/send-issuer-master-key', async (req, res, next) => {
//   try {
//     const { name, email, masterKey } = req.body;
//     const decMasterKey = decrypt(process.env.ISSUER_MASTER_KEY_SECRET, masterKey);
//     if (decMasterKey.status === 0) {
//       throw decMasterKey.data;
//     }
//     const text = 'Thank You for Associating as an Issuer with DigiBlock.';
//     const replacements = {
//       name,
//       masterKey: decMasterKey.data,
//       text,
//     };
//     const maillist = [email];
//     const subject = 'Issuer Master key 🔑';
//     sendMasterKeyMail(path.join(__dirname, '../../assets/static/masterKey.html'), replacements, maillist, subject, text);
//     res.status(200).send('OK');
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/validate-master-key', async (req, res, next) => {
//   try {
//     const { masterKey, masterKeyHash } = req.body;
//     const status = await bcrypt.compare(masterKey, masterKeyHash);
//     res.send({ status });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/verify', async (req, res, next) => {
//   try {
//     const { address } = req.body;
//     const admin = await Admin.findOne({ address: address.toLowerCase() });
//     if (admin.isVerified === false) {
//       await Admin.updateOne({ address: address.toLowerCase() }, { isVerified: true });
//     }
//     res.status(200).send('OK');
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/is-verified', async (req, res, next) => {
//   try {
//     const { address } = req.body;
//     const admin = await Admin.findOne({ address: address.toLowerCase() });
//     res.send({ status: admin.isVerified });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/remove', async (req, res, next) => {
//   try {
//     const { address } = req.body;
//     const admin = await Admin.findOne({ address: address.toLowerCase() });
//     await admin.remove();
//     res.status(200).send('OK');
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
