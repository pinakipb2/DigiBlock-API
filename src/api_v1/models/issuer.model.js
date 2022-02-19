import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

const IssuerSchema = new Schema(
  {
    orgName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    docType: [
      {
        type: String,
        required: true,
        unique: true,
      },
    ],
  },
  { timestamps: true }
);

IssuerSchema.plugin(uniqueValidator);

const Issuer = mongoose.model('issuer', IssuerSchema);

export default Issuer;
