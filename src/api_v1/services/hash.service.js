import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { StatusDataDto } from '../dtos';

class HashService {
  // Generate a Hash (Hmac Object)
  unsafeHash(data) {
    return crypto.createHmac('sha256', process.env.UNSAFE_HASH_SECRET).update(data).digest('hex');
  }

  // Generated Bcrypt hash
  async safeHash(data) {
    const salt = await bcrypt.genSalt(11);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  }

  // Bcrypt comparator
  async compareSafeHash(data, hash) {
    const status = await bcrypt.compare(data, hash);
    return status;
  }

  // Encrypt Algo
  encrypt(_key, text) {
    try {
      const IV = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', _key, IV);
      const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
      const payload = IV.toString('hex') + encrypted + cipher.getAuthTag().toString('hex');
      const payload64 = Buffer.from(payload, 'hex').toString('base64');
      return new StatusDataDto(1, payload64);
    } catch (err) {
      return new StatusDataDto(0, err.message);
    }
  }

  // Decrypt Algo
  decrypt(_key, payload64) {
    try {
      const payload = Buffer.from(payload64, 'base64').toString('hex');
      const IV = payload.substring(0, 32);
      const encrypted = payload.substring(32, payload.length - 32);
      const authTag = payload.substring(payload.length - 32, payload.length);
      const decipher = crypto.createDecipheriv('aes-256-gcm', _key, Buffer.from(IV, 'hex'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      const clearText = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
      return new StatusDataDto(1, clearText);
    } catch (err) {
      return new StatusDataDto(0, err.message);
    }
  }
}

export default new HashService();
