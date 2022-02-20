import express from 'express';
import { issuerController } from '../controllers';

const router = express.Router();

router.get('/generate-master-key', issuerController.generateMasterKey);

router.post('/send-master-key', issuerController.sendMasterKey);

router.post('/add-issuer', issuerController.addIssuer);

router.post('/validate-master-key', issuerController.validateMasterKey);

router.get('/all-issuers', issuerController.allIssuers);

export default router;
