import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'; // no need for duplicate import

// ✅ FIX: add .ts extensions
import { errorHandler } from './middleware/errorHandler.ts';
import authRoutes from './routes/auth.routes.ts';
import itemRoutes from './routes/items.routes.ts';
import bookingRoutes from './routes/bookings.routes.ts';
import userRoutes from './routes/users.routes.ts';
import categoryRoutes from './routes/categories.routes.ts';

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ CORS config
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on: http://localhost:${PORT}`);
  });
}

export default app;
