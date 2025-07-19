import express from 'express';
import {
  createPoll,
  getActivePoll,
  endPoll,
  getAllPolls
} from '../controllers/pollController.js';

const router = express.Router();

// Create a new poll
router.post('/', createPoll);

// Get current active poll
router.get('/active', getActivePoll);

// End a poll
router.patch('/end/:pollId', endPoll);

// Get all past polls
router.get('/all', getAllPolls);

export default router;
