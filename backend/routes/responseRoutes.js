import express from 'express';
import { submitResponse, getPollResults } from '../controllers/responseController.js';

const router = express.Router();

router.post('/', submitResponse);
router.get('/:pollId', getPollResults);

export default router;
