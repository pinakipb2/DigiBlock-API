import express from 'express';
import { issuerController } from '../controllers';

const router = express.Router();

router.post('/validate-master-key', issuerController.validateMasterKey);

router.post('/add-issuer', issuerController.addIssuer);

router.get('/all-issuers', issuerController.allIssuers);

export default router;
