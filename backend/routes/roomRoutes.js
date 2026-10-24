import { Router } from 'express';
import Room from '../models/Room.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{const filter={};if(req.query.hostelId){if(!/^[a-f\d]{24}$/i.test(req.query.hostelId))return res.json({rooms:[]});filter.hostel=req.query.hostelId;}if(req.query.available==='true')filter.available=true;const rooms=await Room.find(filter).populate('hostel','name').sort({number:1}).limit(300);res.json({rooms});}catch(e){next(e)}});
export default router;
