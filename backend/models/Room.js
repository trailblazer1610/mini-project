import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({hostel:{type:mongoose.Schema.Types.ObjectId,ref:'Hostel',required:true,index:true},number:{type:String,required:true},type:{type:String,enum:['AC','Non-AC'],default:'Non-AC'},sharing:{type:Number,default:2,min:1},price:{type:Number,required:true,min:1},available:{type:Boolean,default:true}},{timestamps:true});
roomSchema.index({hostel:1,number:1},{unique:true});
export default mongoose.model('Room',roomSchema);
