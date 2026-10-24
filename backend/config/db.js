import mongoose from 'mongoose';
import Hostel from '../models/Hostel.js';
import Room from '../models/Room.js';

export async function connectDB() {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('PASTE_YOUR')) {
    throw new Error('MONGO_URI is missing. Copy backend/.env.example to backend/.env and paste your MongoDB connection string.');
  }
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  // Add starter demo records only when the hostels collection is empty.
  if (await Hostel.countDocuments() === 0) {
    const docs = await Hostel.insertMany([
      {name:'Sunrise Residency',college:'GL Bajaj Institute of Technology & Management',gender:'male',price:8000,rating:4.3,distanceKm:0.5,gym:false,noRestriction:false,amenities:['Wi-Fi','Mess','Laundry'],description:'A comfortable student stay close to campus.'},
      {name:'Green Valley PG',college:'KCC Institute of Technology & Management',gender:'female',price:9500,rating:4.6,distanceKm:0.8,gym:false,noRestriction:false,amenities:['AC','Mess','CCTV'],description:'A welcoming PG with essential student facilities.'},
      {name:'Campus View Hostel',college:'Noida Institute of Engineering & Technology (NIET)',gender:'male',price:7200,rating:4.1,distanceKm:1.2,gym:true,noRestriction:true,amenities:['Wi-Fi','Gym','Mess','No Entry Restriction'],description:'A practical option for students who want to stay near NIET.'},
      {name:'Elite Girls PG',college:'Galgotias University',gender:'female',price:10000,rating:4.7,distanceKm:0.3,gym:false,noRestriction:false,amenities:['AC','Laundry','Security','Mess'],description:'A student-friendly PG with security and daily essentials.'},
      {name:'Maple Boys Hostel',college:'Shiv Nadar University',gender:'male',price:6800,rating:4.0,distanceKm:1.5,gym:true,noRestriction:true,amenities:['Wi-Fi','Gym','No Entry Restriction'],description:'Affordable accommodation with gym access.'},
      {name:'Rose Petal Girls PG',college:'Amity University',gender:'female',price:8800,rating:4.5,distanceKm:0.6,gym:true,noRestriction:false,amenities:['AC','Gym','Mess','CCTV'],description:'Comfortable rooms and a convenient location.'}
    ]);
    const roomDocs=[];
    const patterns=[['G1',true,'AC',2,12000],['G2',false,'AC',2,12000],['G3',true,'Non-AC',3,8000],['101',true,'AC',3,10500],['102',false,'Non-AC',2,9500],['201',true,'AC',2,12000]];
    for (const hostel of docs) for (const [number,available,type,sharing,price] of patterns) roomDocs.push({hostel:hostel._id,number,type,sharing,price,available});
    await Room.insertMany(roomDocs);
    console.log('Inserted sample hostels and rooms.');
  }
}
