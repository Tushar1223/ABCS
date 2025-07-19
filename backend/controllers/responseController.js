import Response from '../models/Response.js';

export const submitResponse = async (req, res) => {
  try {
    const { pollId, studentName, selectedOption } = req.body;

    const existing = await Response.findOne({ pollId, studentName });
    if (existing) {
      return res.status(400).json({ message: 'Already answered' });
    }

    const response = new Response({ pollId, studentName, selectedOption });
    await response.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

export const getPollResults = async (req, res) => {
  try {
    const { pollId } = req.params;
    const responses = await Response.find({ pollId });

    const counts = {};
    responses.forEach((r) => {
      counts[r.selectedOption] = (counts[r.selectedOption] || 0) + 1;
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch poll results' });
  }
};
