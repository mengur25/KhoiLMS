import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*', // Allows local dev frontend from any port
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Khoi LMS - Tutoring Management System',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('Khoi LMS Backend API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi hệ thống máy chủ',
  });
});

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed if database is empty (e.g. fresh in-memory or fresh local db)
    const { Lesson } = await import('./models/Lesson.js');
    const count = await Lesson.countDocuments();
    if (count === 0) {
      console.log('📦 Database is empty. Auto-seeding initial curriculum and demo accounts...');
      const { seedDatabase } = await import('./utils/seed.js');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Khoi LMS Backend running at: http://localhost:${PORT}`);
      console.log(`📡 Google Form Webhook endpoint: http://localhost:${PORT}/api/webhooks/google-form`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Cổng ${PORT} đang bị chiếm dụng bởi một tiến trình khác!`);
        console.log(`👉 Cách khắc phục: Chạy lệnh sau để giải phóng cổng:\n   lsof -ti:${PORT} | xargs kill -9`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
