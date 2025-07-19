import express from 'express';
import cors from 'cors';
import pollRoutes from './routes/pollRoutes.js';
import responseRoutes from './routes/responseRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/polls', pollRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/messages', messageRoutes);

export default app;
