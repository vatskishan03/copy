// backend/src/models/snippet.model.ts
import mongoose, { Schema } from 'mongoose';
import { Snippet } from '../../../shared/types'; 

const snippetSchema: Schema<Snippet> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
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

const Snippet = mongoose.model<Snippet>('Snippet', snippetSchema);
export default Snippet;
