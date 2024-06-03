// backend/src/models/usedToken.model.ts

import mongoose from 'mongoose';

const usedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
});

const UsedToken = mongoose.model('UsedToken', usedTokenSchema);
export default UsedToken;
