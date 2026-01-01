const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  userId: String,
  messages: [
    {
      role: String,
      message: String

    }
  ]
}, {
  timestamps: true
});

ConversationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
