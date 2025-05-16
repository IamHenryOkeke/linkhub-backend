import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello from Express + TypeScript!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
