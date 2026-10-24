import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import HostelDetail from './pages/HostelDetail.jsx';
import Auth from './pages/Auth.jsx';
import Mess from './pages/Mess.jsx';
import { Admin, MyEnquiries } from './pages/Account.jsx';
import { api } from './services/api.js';
function Protected({user,children,admin=false}){if(!user)return <Navigate to="/login" replace/>;if(admin&&user.role!=='admin')return <Navigate to="/" replace/>;return children;}
export default function App(){const [user,setUser]=useState(null);const [checked,setChecked]=useState(false);useEffect(()=>{if(localStorage.getItem('hostel_token'))api('/api/auth/me').then(d=>setUser(d.user)).catch(()=>localStorage.removeItem('hostel_token')).finally(()=>setChecked(true));else setChecked(true)},[]);function logout(){localStorage.removeItem('hostel_token');setUser(null)}if(!checked)return <div className="loading-screen">Loading StayNest…</div>;return <Layout user={user} onLogout={logout}><Routes><Route path="/" element={<Home/>}/><Route path="/hostels/:id" element={<HostelDetail user={user}/>}/><Route path="/mess" element={<Mess/>}/><Route path="/login" element={user?<Navigate to="/" replace/>:<Auth mode="login" onLogin={setUser}/>}/><Route path="/register" element={user?<Navigate to="/" replace/>:<Auth mode="register" onLogin={setUser}/>}/><Route path="/my-enquiries" element={<Protected user={user}><MyEnquiries/></Protected>}/><Route path="/admin" element={<Protected user={user} admin><Admin/></Protected>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Layout>}
