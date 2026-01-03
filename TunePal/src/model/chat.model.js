const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId
  },
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
