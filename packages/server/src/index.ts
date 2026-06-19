import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/books.routes';
import memberRoutes from './routes/members.routes';
import checkoutRoutes from './routes/checkouts.routes';
import reservationRoutes from './routes/reservations.routes';
import fineRoutes from './routes/fines.routes';
import dashboardRoutes from './routes/dashboard.routes';

import { calculateOverdueFines } from './jobs/fine-calculator.job';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/checkouts', checkoutRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Schedule fine calculation job (runs daily at midnight)
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily fine calculation job...');
  await calculateOverdueFines();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});