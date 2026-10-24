import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import hostelRoutes from './routes/hostelRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

const app=express();
const allowedOrigins=(process.env.FRONTEND_URL||'http://localhost:5173').split(',').map(x=>x.trim()).filter(Boolean);
app.use(cors({origin(origin,callback){if(!origin||allowedOrigins.includes(origin)||process.env.NODE_ENV!=='production')return callback(null,true);return callback(new Error('This frontend origin is not allowed by CORS. Check FRONTEND_URL in backend environment variables.'));},credentials:false}));
app.use(express.json({limit:'1mb'}));
app.get('/api/health',(req,res)=>res.json({ok:true,message:'StayNest API is running.'}));
// Ensure the database is connected before handling API requests. Vercel can reuse the connection between invocations.
app.use('/api',async(req,res,next)=>{try{await connectDB();next();}catch(e){next(e)}});
app.use('/api/auth',authRoutes);
app.use('/api/hostels',hostelRoutes);
app.use('/api/rooms',roomRoutes);
app.use('/api/enquiries',enquiryRoutes);
app.use('/api/admin/enquiries',enquiryRoutes);
app.use((req,res)=>res.status(404).json({message:'API route not found.'}));
app.use((err,req,res,next)=>{console.error(err.message);if(err.code===11000)return res.status(409).json({message:'A record with this value already exists.'});if(err.name==='ValidationError')return res.status(400).json({message:err.message});res.status(500).json({message:process.env.NODE_ENV==='production'?'Server error. Check backend logs and environment variables.':err.message});});
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`StayNest API running at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error(err.message);
      console.error(
        'The server was not started because the database connection is not configured. Create backend/.env first.'
      );
      process.exit(1);
    });
} else {
  app.listen(PORT, () => {
    console.log(`StayNest API running on port ${PORT}`);
  });
}

export default app;