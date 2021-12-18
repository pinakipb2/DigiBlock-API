const mongoose = require('mongoose');

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

const Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;
