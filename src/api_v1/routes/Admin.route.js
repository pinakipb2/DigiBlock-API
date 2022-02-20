import express from 'express';
import { adminController } from '../controllers';

const router = express.Router();

router.get('/generate-master-key', adminController.generateMasterKey);

router.post('/send-master-key', adminController.sendMasterKey);

router.post('/add-admin', adminController.addAdmin);

router.post('/validate-master-key', adminController.validateMasterKey);

router.post('/verify', adminController.verifyAdmin);

router.post('/is-verified', adminController.isAdminVerified);

router.post('/remove', adminController.removeAdmin);

export default router;
