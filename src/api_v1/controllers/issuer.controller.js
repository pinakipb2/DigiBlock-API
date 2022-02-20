import createError from 'http-errors';
import path from 'path';
import { errorLogger } from '../log/logger';
import { MasterKeyService, HashService, sendMasterKeyMail } from '../services';
import { Admin, Issuer } from '../models';
import { IssuerDto, StatusDataDto } from '../dtos';
import { masterKeySchema, issuerSchema, userSendEmailSchema } from '../validations';

const issuerController = {
  async generateMasterKey(req, res, next) {
    try {
      // Generate a master key of length 14
      const masterKey = MasterKeyService.generateMasterKey();
      // Encrypt the master key
      const encMasterKey = HashService.encrypt(process.env.ISSUER_MASTER_KEY_SECRET, masterKey);
      if (encMasterKey.status === 0) {
        errorLogger.error('Error in encryption in adminController in generateIssuerMasterKey');
        return next(createError.InternalServerError());
      }
      // Two times Hashing the master key
      const hash = HashService.unsafeHash(masterKey);
      const hashedMasterKey = await HashService.safeHash(hash);
      // Sending encrypted master key and two times hashed master key
      res.send({ masterKey: encMasterKey.data, hashedMasterKey });
    } catch (err) {
      errorLogger.error('Error in unsafeHash or safeHash in adminController in generateIssuerMasterKey');
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
        errorLogger.error('Error in request body validation in issuerController in validateMasterKey');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error('Error in compareSafeHash in issuerController in validateMasterKey');
      return next(createError.InternalServerError());
    }
  },
  async addIssuer(req, res, next) {
    try {
      // Validate req.body payload
      const result = await issuerSchema.validateAsync(req.body);
      const { orgName, address, docType } = result;
      // Check if Admin and Issuer exists
      const existAdmin = await Admin.exists({ address });
      const existIssuer = await Issuer.exists({ address });
      if (existAdmin || existIssuer) {
        errorLogger.error('Address already exists in issuerController in addIssuer');
        return next(createError.Conflict('This address is already taken'));
      }
      // Add the new Issuer
      const issuer = new Issuer({
        orgName,
        address,
        docType,
      });
      await issuer.save();
      // Send OK if everything passes
      const ok = new StatusDataDto(1, 'Issuer Added');
      res.send(ok);
    } catch (err) {
      if (err.isJoi === true) {
        errorLogger.error('Error in request body validation in issuerController in addIssuer');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error('Error in saving Issuer in DB in issuerController in addIssuer');
      return next(createError.InternalServerError());
    }
  },
  async sendMasterKey(req, res, next) {
    try {
      // Validate req.body payload
      const result = await userSendEmailSchema.validateAsync(req.body);
      const { name, email, masterKey } = result;
      // Decrypt Master Key
      const decMasterKey = HashService.decrypt(process.env.ISSUER_MASTER_KEY_SECRET, masterKey);
      if (decMasterKey.status === 0) {
        errorLogger.error('Error in decryption in adminController in sendIssuerMasterKey');
        return next(createError.InternalServerError());
      }
      const text = 'Thank You for Associating as an Issuer with DigiBlock.';
      const replacements = {
        name,
        masterKey: decMasterKey.data,
        text,
        year: new Date().getFullYear(),
      };
      const maillist = [email];
      const subject = 'Issuer Master key 🔑';
      // Send email
      await sendMasterKeyMail(path.join(__dirname, '../../assets/static/masterKey.html'), replacements, maillist, subject, text);
      const ok = new StatusDataDto(1, 'Mail Sent');
      res.send(ok);
    } catch (err) {
      if (err.isJoi === true) {
        errorLogger.error('Error in request body validation in adminController in sendIssuerMasterKey');
        return next(createError.UnprocessableEntity(err.message));
      }
      errorLogger.error(`Error in sending mail to ${req.body.email} in adminController in sendIssuerMasterKey`);
      return next(createError.InternalServerError());
    }
  },
  async allIssuers(req, res, next) {
    try {
      // Get all Issuers from DB
      const issuers = await Issuer.find({});
      const allIssuers = issuers.map((issuer) => new IssuerDto(issuer));
      // Return all Issuers (modified DTOs)
      res.json(allIssuers);
    } catch (err) {
      errorLogger.error('Error in issuerController in allIssuers');
      return next(createError.InternalServerError());
    }
  },
};

export default issuerController;
