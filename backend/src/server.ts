import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from './routes/profile.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Ilusia Storage Hub API' });
});

// Routes
app.use('/api/profile', profileRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 