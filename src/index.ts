import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import routes from './routes';
import { setupSwagger } from './swagger/swagger';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger/swaggerDocument';
import logger from './utils/logger';
import authRoutes from "./routes/auth.route";
import cors from 'cors';  // Import the CORS middleware
// import cookie from 'cookie-parser'
dotenv.config();

const app = express();

// Enable CORS with specific settings
app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3001"], // Allow frontend to access backend
    credentials: true, // Allow cookies, authorization headers, etc.
}));

// Setup Swagger
setupSwagger(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use('/api', routes());
app.use("/auth", authRoutes);
// app.use(cookie())
// Connect to Database
connectDB()
    .then(() => logger.info('Database connected successfully'))
    .catch((error) => logger.error('Database connection failed:', error));

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        logger.info(`🚀 Server is running at http://localhost:${PORT}/api`);
    });
}

export default app;
