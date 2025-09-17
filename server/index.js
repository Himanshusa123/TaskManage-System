import express from'express';
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './mongodb/connect.js';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config();

const app=express();
app.use(express.json())

// middleware to handle cors 
app.use(cors({
  origin:process.env.CLIENT_URL || "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/tasks',taskRoutes)
app.use('/api/reports',reportRoutes)


// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// server upload folder
app.use('/uploads', express.static(path.join(__dirname, "uploads")));

// start the server
const startServer = async () => {
    try {
      connectDB(process.env.MONGODB_URL);
      app.listen(8080, () => console.log('Server started on port 8080'));
    } catch (error) {
      console.log(error);
    }
  };
  
  startServer();