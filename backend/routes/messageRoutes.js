import express from 'express';
import { getMessagesByPoll, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/:pollId', getMessagesByPoll);
router.post('/', sendMessage);

export default router;
