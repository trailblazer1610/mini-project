import mongoose from 'mongoose';
const enquirySchema = new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},hostel:{type:mongoose.Schema.Types.ObjectId,ref:'Hostel'},hostelName:{type:String,required:true},message:{type:String,required:true,trim:true,maxlength:1000},status:{type:String,enum:['new','contacted','closed'],default:'new'}},{timestamps:true});
export default mongoose.model('Enquiry',enquirySchema);
