import createError from 'http-errors';
import { errorLogger } from '../log/logger';
import { HashService } from '../services';
import { Admin, Issuer } from '../models';
import { IssuerDto, StatusDataDto } from '../dtos';
import { masterKeySchema, issuerSchema } from '../validations';

const issuerController = {
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
