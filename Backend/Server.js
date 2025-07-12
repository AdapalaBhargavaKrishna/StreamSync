import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import roomRoutes from './routes/roomRoutes.js';
import { socketHandler } from './socket.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const allowedOrigin = "https://streamsyncc.vercel.app";

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST']
  }
});

socketHandler(io);

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/rooms', roomRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('Welcome to StreamSync Backend'));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));