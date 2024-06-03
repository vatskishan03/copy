// backend/src/models/snippet.model.ts
import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true, // Ensure each token is unique
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
    required: true,
    default: () => new Date(Date.now() + 6 * 60 * 60 * 1000), // You can choose to make this required if you want all snippets to expire
  },
});

const Snippet = mongoose.model('Snippet', snippetSchema);
export default Snippet;
