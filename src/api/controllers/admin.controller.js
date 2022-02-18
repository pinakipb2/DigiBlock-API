import createError from 'http-errors';
import { MasterKeyService, HashService } from '../services';

const adminController = {
  async generateMasterKey(req, res, next) {
    try {
      const masterKey = MasterKeyService.generateMasterKey();
      const encMasterKey = HashService.encrypt(process.env.ADMIN_MASTER_KEY_SECRET, masterKey);
      if (encMasterKey.status === 0) {
        throw encMasterKey.data;
      }
      const hash = HashService.unsafeHash(masterKey);
      const hashedMasterKey = await HashService.safeHash(hash);
      res.send({ masterKey: encMasterKey.data, hashedMasterKey });
    } catch (err) {
      return next(createError.InternalServerError());
    }
  },
};

export default adminController;
