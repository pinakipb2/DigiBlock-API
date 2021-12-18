const { customAlphabet } = require('nanoid');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const genMasterKey = customAlphabet(alphabet, 14);
module.exports = genMasterKey;
