import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import routes from './routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', routes());

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running at http://localhost:${PORT}/api`));