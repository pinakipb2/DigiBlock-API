import { customAlphabet } from 'nanoid';

class MasterKeyService {
  generateMasterKey() {
    this.alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const masterKey = customAlphabet(this.alphabet, 14);
    return masterKey();
  }
}
export default new MasterKeyService();
