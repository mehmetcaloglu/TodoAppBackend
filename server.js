import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import mime from 'mime';

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.get('/download', (req, res) => {
  // take filename from query string
  const { filename } = req.query;
  // create file path from uploads/files
  const filePath = path.join(path.resolve(), 'uploads', 'files', filename);
  // send file to client
  res.download(filePath, (err) => {
    if (err) {
      console.error('Dosya indirme hatası:', err);
    }
  });

});
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'), {
  setHeaders: (res, filePath) => {
    const mimeType = mime.getType(filePath);
    console.log(mimeType);
    res.setHeader('Content-Type', mimeType);
  }
}));
app.use('/api/auth', (await import('./routes/authRoutes.js')).default);
app.use('/api/todo', (await import('./routes/todoRoutes.js')).default);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
