const crypto = require('crypto');

// For AES256
const key1 = crypto
  .randomBytes(16)
  .toString('hex')
  .split('')
  .map((ch) => (Math.round(Math.random()) ? ch.toUpperCase() : ch.toLowerCase()))
  .join('');
const key2 = crypto
  .randomBytes(16)
  .toString('hex')
  .split('')
  .map((ch) => (Math.round(Math.random()) ? ch.toUpperCase() : ch.toLowerCase()))
  .join('');

// For Secret Keys
const key3 = crypto
  .randomBytes(32)
  .toString('hex')
  .split('')
  .map((ch) => (Math.round(Math.random()) ? ch.toUpperCase() : ch.toLowerCase()))
  .join('');

console.table({ key1, key2, key3 });
