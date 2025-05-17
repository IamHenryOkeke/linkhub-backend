import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './routes/index.routes';
import { CustomError } from './lib/type';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'The route you are looking for does not exist.',
  });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode,
    message: err.message || 'Something went wrong',
    details: err.details ?? undefined,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
