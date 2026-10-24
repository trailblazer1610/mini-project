import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  collegeName: { type: String, trim: true, maxlength: 120, default: '' },
  fatherName: { type: String, trim: true, maxlength: 100, default: '' },
  mobileNumber: { type: String, trim: true, default: '' },
  courseBranch: { type: String, trim: true, maxlength: 100, default: '' },
  currentAddress: { type: String, trim: true, maxlength: 300, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
