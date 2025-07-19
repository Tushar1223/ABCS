import Message from '../models/Message.js';

export const getMessagesByPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const messages = await Message.find({ pollId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender, message, pollId } = req.body;
    const saved = await Message.create({ sender, message, pollId });
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
