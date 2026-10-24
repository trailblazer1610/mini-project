import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
// The predefined admin credentials are checked only on the backend.
// Change this password before deploying the project publicly.
const ADMIN_EMAIL = 'admin1610@gmail.com';
const ADMIN_PASSWORD = 'kk16102005';

const safeUser = user => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  collegeName: user.collegeName || '',
  fatherName: user.fatherName || '',
  mobileNumber: user.mobileNumber || '',
  courseBranch: user.courseBranch || '',
  currentAddress: user.currentAddress || ''
});
const tokenFor = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, collegeName, fatherName, mobileNumber, courseBranch, currentAddress } = req.body;
    if (!name?.trim() || !email?.trim() || !password || !collegeName?.trim() || !fatherName?.trim() || !mobileNumber?.trim()) {
      return res.status(400).json({ message: "Name, email, password, college name, father's name and mobile number are required." });
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must contain at least 6 characters.' });
    const normalized = email.trim().toLowerCase();
    if (normalized === ADMIN_EMAIL) return res.status(403).json({ message: 'This email is reserved for the StayNest administrator.' });
    if (!/^[+]?[-()\s\d]{10,16}$/.test(mobileNumber.trim())) return res.status(400).json({ message: 'Enter a valid mobile number.' });
    if (await User.findOne({ email: normalized })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({
      name: name.trim(), email: normalized, passwordHash: await bcrypt.hash(password, 12),
      collegeName: collegeName.trim(), fatherName: fatherName.trim(), mobileNumber: mobileNumber.trim(),
      courseBranch: courseBranch?.trim() || '', currentAddress: currentAddress?.trim() || '', role: 'student'
    });
    res.status(201).json({ message: 'Account created.', user: safeUser(user), token: tokenFor(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const normalized = email.trim().toLowerCase();

    // Bootstrap the predefined admin account in MongoDB the first time it logs in.
    // The role is assigned only after the exact admin email AND password match here.
    if (normalized === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      const user = await User.findOneAndUpdate(
        { email: ADMIN_EMAIL },
        { $set: { name: 'StayNest Admin', email: ADMIN_EMAIL, passwordHash, role: 'admin' }, $setOnInsert: { collegeName: '', fatherName: '', mobileNumber: '', courseBranch: '', currentAddress: '' } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
      return res.json({ message: 'Admin logged in successfully.', user: safeUser(user), token: tokenFor(user) });
    }

    const user = await User.findOne({ email: normalized });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    res.json({ message: 'Logged in successfully.', user: safeUser(user), token: tokenFor(user) });
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json({ user: safeUser(req.user) }));
export default router;
