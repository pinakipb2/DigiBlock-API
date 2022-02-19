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
      const Text = text.toString();
      const key = Buffer.from(_key, 'utf-8');
      const plainText = Buffer.from(Text, 'utf8');
      const cipher = crypto.createCipheriv('aes-256-ecb', key, Buffer.from([]));
      const cipherText = Buffer.concat([cipher.update(plainText), cipher.final()]).toString('base64');
      return new StatusDataDto(1, cipherText);
    } catch (err) {
      return new StatusDataDto(0, err.message);
    }
  }

  // Decrypt Algo
  decrypt(_key, text) {
    try {
      const key = Buffer.from(_key, 'utf-8');
      const decipher = crypto.createDecipheriv('aes-256-ecb', key, Buffer.from([]));
      const clearText = decipher.update(text, 'base64', 'utf8') + decipher.final('utf-8');
      return new StatusDataDto(1, clearText);
    } catch (err) {
      return new StatusDataDto(0, err.message);
    }
  }
}

export default new HashService();
