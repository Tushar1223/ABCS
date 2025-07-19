import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String, // "teacher" or student name
    required: true
  },
  message: {
    type: String,
    required: true
  },
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
