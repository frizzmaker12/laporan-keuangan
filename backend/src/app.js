import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { testDatabaseConnection } from './config/database.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Laporan Keuangan backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

(async () => {
  await testDatabaseConnection();
})();

export default app;
