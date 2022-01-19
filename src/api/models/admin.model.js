const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

AdminSchema.plugin(uniqueValidator);

const Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;
