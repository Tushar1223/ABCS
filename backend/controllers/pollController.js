import Poll from '../models/Poll.js';
import Response from '../models/Response.js';

export const createPoll = async (req, res) => {
  try {
    const { question, options, duration } = req.body;
    const poll = new Poll({ question, options, duration });
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create poll' });
  }
};

export const getActivePoll = async (req, res) => {
  try {
    const poll = await Poll.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!poll) return res.status(404).json({ message: 'No active poll' });
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
};

export const endPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    await Poll.findByIdAndUpdate(pollId, { isActive: false });
    res.json({ message: 'Poll ended' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end poll' });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find({}).sort({ createdAt: -1 });
    const enrichedPolls = await Promise.all(polls.map(async (poll) => {
      const responses = await Response.find({ pollId: poll._id });
      const resultCount = {};

      poll.options.forEach(opt => resultCount[opt] = 0);

      responses.forEach(r => {
        if (resultCount[r.selectedOption] !== undefined) {
          resultCount[r.selectedOption]++;
        }
      });

      return {
        ...poll._doc,
        result: resultCount
      };
    }));

    res.json(enrichedPolls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch past polls' });
  }
};

