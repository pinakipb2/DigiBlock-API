import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

AdminSchema.plugin(uniqueValidator);

const Admin = mongoose.model('admin', AdminSchema);

export default Admin;
