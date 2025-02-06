import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import routes from './routes';
import { setupSwagger } from "./swagger/swagger";
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger/swaggerDocument';

dotenv.config();

const app = express();

setupSwagger(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use('/api', routes());

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running at http://localhost:${PORT}/api`));