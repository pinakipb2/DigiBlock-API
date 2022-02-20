import createError from 'http-errors';
import path from 'path';
import { errorLogger } from '../log/logger';
import { MasterKeyService, HashService, sendMasterKeyMail } from '../services';
import { Admin, Issuer } from '../models';
import { addressSchema, masterKeySchema, userSendEmailSchema } from '../validations';
import { StatusDataDto } from '../dtos';

const adminController = {
  async generateMasterKey(req, res, next) {
    try {
      // Generate a master key of length 14
      const masterKey = MasterKeyService.generateMasterKey();
      // Encrypt the master key
      const encMasterKey = HashService.encrypt(process.env.ADMIN_MASTER_KEY_SECRET, masterKey);
      if (encMasterKey.status === 0) {
        errorLogger.error('Error in encryption in adminController in generateMasterKey');
        return next(createError.InternalServerError());
      }
      // Two times Hashing the master key
      const hash = HashService.unsafeHash(masterKey);
      const hashedMasterKey = await HashService.safeHash(hash);
      // Sending encrypted master key and two times hashed master key
      res.send({ masterKey: encMasterKey.data, hashedMasterKey });
    } catch (err) {
      errorLogger.error('Error in unsafeHash or safeHash in adminController in generateMasterKey');
      return next(createError.InternalServerError());
    }
  },
  async validateMasterKey(req, res, next) {
    try {
      // Validate req.body payload
      const result = await masterKeySchema.validateAsync(req.body);
      const { masterKey, masterKeyHash } = result;
      // unsafeHash the masterKey from payload and compare with safeHash
      const hash = HashService.unsafeHash(masterKey);
      const status = await HashService.compareSafeHash(hash, masterKeyHash);
      // sending boolean on validation
      const ok = new StatusDataDto(status, '');
      res.send(ok);
    } catch (err) {
      if (err.isJoi === true) {
        errorLogger.error('Error in request body validation in adminController in validateMasterKey');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error('Error in compareSafeHash in adminController in validateMasterKey');
      return next(createError.InternalServerError());
    }
  },
  async addAdmin(req, res, next) {
    try {
      // Validate req.body payload
      const result = await addressSchema.validateAsync(req.body);
      const { address } = result;
      // Check if Admin and Issuer exists
      const existAdmin = await Admin.exists({ address });
      const existIssuer = await Issuer.exists({ address });
      if (existAdmin || existIssuer) {
        errorLogger.error('Address already exists in adminController in addAdmin');
        return next(createError.Conflict('This address is already taken'));
      }
      // Add the new Admin
      const admin = new Admin({
        address,
      });
      await admin.save();
      // Send OK if everything passes
      const ok = new StatusDataDto(1, 'Admin Added');
      res.send(ok);
    } catch (err) {
      if (err.isJoi === true) {
        errorLogger.error('Error in request body validation in adminController in addAdmin');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error('Error in saving Admin in DB in adminController in addAdmin');
      return next(createError.InternalServerError());
    }
  },
  async verifyAdmin(req, res, next) {
    try {
      // Validate req.body payload
      const result = await addressSchema.validateAsync(req.body);
      const { address } = result;
      // Check whether the admin is present in DB
      const admin = await Admin.findOne({ address });
      if (!admin) {
        errorLogger.error('Admin is not found in DB in adminController in verifyAdmin');
        return next(createError.Unauthorized());
      }
      // Check if admin is verified
      if (admin.isVerified === false) {
        await Admin.updateOne({ address }, { isVerified: true });
      }
      // Sending OK status if everything passes
      const ok = new StatusDataDto(1, 'Admin Verified');
      res.send(ok);
    } catch (err) {
      if (err.isJoi === true) {
        errorLogger.error('Error in request body validation in adminController in verifyAdmin');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error('Error in updating Admin in DB in adminController in verifyAdmin');
      return next(createError.InternalServerError());
    }
  },
  async isAdminVerified(req, res, next) {
    try {
      // Validate req.body payload
      const result = await addressSchema.validateAsync(req.body);
      const { address } = result;
      // Check whether the admin is present in DB
      const admin = await Admin.findOne({ address });
      if (!admin) {
        errorLogger.error('Admin is not found in DB in adminController in isAdminVerified');
        return next(createError.Unauthorized());
      }
      // Sending boolean on isVerified
      const ok = new StatusDataDto(admin.isVerified, '');
      res.send(ok);
    } catch (err) {
      if (err.isJoi === true) {
        errorLogger.error('Error in request body validation in adminController in isAdminVerified');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error('Error in adminController in isAdminVerified');
      return next(createError.InternalServerError());
    }
  },
  async removeAdmin(req, res, next) {
    try {
      // Validate req.body payload
      const result = await addressSchema.validateAsync(req.body);
      const { address } = result;
      // Check whether the admin is present in DB
      const admin = await Admin.findOne({ address });
      if (!admin) {
        errorLogger.error('Admin is not found in DB in adminController in removeAdmin');
        return next(createError.Unauthorized());
      }
      // Remove admin from DB
      await admin.remove();
      // Sending OK status if everything passes
      const ok = new StatusDataDto(1, 'Admin Removed');
      res.send(ok);
    } catch (err) {
      if (err.isJoi === true) {
        errorLogger.error('Error in request body validation in adminController in removeAdmin');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error('Error in removing Admin in adminController in removeAdmin');
      return next(createError.InternalServerError());
    }
  },
  async sendMasterKey(req, res, next) {
    try {
      // Validate req.body payload
      const result = await userSendEmailSchema.validateAsync(req.body);
      const { name, email, masterKey } = result;
      // Decrypt Master Key
      const decMasterKey = HashService.decrypt(process.env.ADMIN_MASTER_KEY_SECRET, masterKey);
      if (decMasterKey.status === 0) {
        errorLogger.error('Error in decryption in adminController in sendMasterKey');
        return next(createError.InternalServerError());
      }
      const text = 'Thank You for Associating as an Admin with DigiBlock.';
      const replacements = {
        name,
        masterKey: decMasterKey.data,
        text,
        year: new Date().getFullYear(),
      };
      const maillist = [email];
      const subject = 'Admin Master key 🔑';
      // Send email
      await sendMasterKeyMail(path.join(__dirname, '../../assets/static/masterKey.html'), replacements, maillist, subject, text);
      const ok = new StatusDataDto(1, 'Mail Sent');
      res.send(ok);
    } catch (err) {
      if (err.isJoi === true) {
        errorLogger.error('Error in request body validation in adminController in sendMasterKey');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error(`Error in sending mail to ${req.body.email} in adminController in sendMasterKey`);
      return next(createError.InternalServerError());
    }
  },
};

export default adminController;
