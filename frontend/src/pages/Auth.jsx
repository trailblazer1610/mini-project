import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

const emptyForm = { name: '', email: '', password: '', collegeName: '', fatherName: '', mobileNumber: '', courseBranch: '', currentAddress: '' };

export default function Auth({ mode, onLogin }) {
  const signup = mode === 'register';
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  function update(field, value) { setForm(current => ({ ...current, [field]: value })); }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const data = await api(`/api/auth/${signup ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(form) });
      localStorage.setItem('hostel_token', data.token);
      onLogin(data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <section className="auth-wrap">
    <div className="auth-art"><span className="brand-mark big-mark">S</span><span className="eyebrow">YOUR NEXT CHAPTER</span><h1>A place to stay.<br/><em>A place to grow.</em></h1><p>Find student-friendly hostels close to your campus, compare amenities and contact the host.</p><div className="auth-art-note">⌂ <span>Find your fit<br/><small>Comfort · Community · Convenience</small></span></div></div>
    <div className="auth-form-area"><form className="auth-form" onSubmit={submit}>
      <span className="eyebrow">WELCOME TO STAYNEST</span><h2>{signup ? 'Create your account' : 'Welcome back'}</h2>
      <p className="muted">{signup ? 'Join students finding a better place to stay.' : 'Log in to manage your hostel enquiries.'}</p>
      {signup && <>
        <label>Full name<input required minLength="2" maxLength="80" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" autoComplete="name"/></label>
        <label>College name<input required maxLength="120" value={form.collegeName} onChange={e => update('collegeName', e.target.value)} placeholder="Your college / institute"/></label>
        <label>Father's name<input required maxLength="100" value={form.fatherName} onChange={e => update('fatherName', e.target.value)} placeholder="Father's full name"/></label>
        <label>Mobile number<input required type="tel" inputMode="tel" pattern="[+]?[-() 0-9]{10,16}" value={form.mobileNumber} onChange={e => update('mobileNumber', e.target.value)} placeholder="Your mobile number" autoComplete="tel"/></label>
        <label>Course / branch (optional)<input maxLength="100" value={form.courseBranch} onChange={e => update('courseBranch', e.target.value)} placeholder="e.g. B.Tech, CSE"/></label>
        <label>Current address (optional)<input maxLength="300" value={form.currentAddress} onChange={e => update('currentAddress', e.target.value)} placeholder="City or current address" autoComplete="street-address"/></label>
      </>}
      <label>Email address<input type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
      <label>Password<input type="password" required minLength="6" value={form.password} onChange={e => update('password', e.target.value)} placeholder="At least 6 characters" autoComplete={signup ? 'new-password' : 'current-password'}/></label>
      {error && <p className="error-message">{error}</p>}
      <button disabled={busy} className="btn btn-primary full-width">{busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}</button>
      <p className="auth-switch">{signup ? 'Already have an account?' : 'New to StayNest?'} <Link to={signup ? '/login' : '/register'}>{signup ? 'Log in' : 'Create account'}</Link></p>
      {signup && <p className="tiny-text muted">No OTP is required. Please do not enter Aadhaar or other highly sensitive ID numbers.</p>}
    </form></div>
  </section>;
}
