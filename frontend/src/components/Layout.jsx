import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Layout({ children, user, onLogout }) {
  const navigate = useNavigate();
  function logout() { onLogout(); navigate('/'); }
  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark">S</span><span>StayNest<small>HOSTEL FINDER</small></span></Link>
      <nav className="nav-links">
        <NavLink to="/">Explore</NavLink><NavLink to="/mess">Mess menu</NavLink>
        {user && <NavLink to="/my-enquiries">My enquiries</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-account">{user ? <><span className="user-greeting">Hi, {user.name.split(' ')[0]}</span><button className="btn btn-outline btn-small" onClick={logout}>Log out</button></> : <Link className="btn btn-primary btn-small" to="/login">Log in</Link>}</div>
    </header>
    <main>{children}</main>
    <footer className="footer"><div className="brand footer-brand"><span className="brand-mark">S</span><span>StayNest<small>HOSTEL FINDER</small></span></div><span>Find a comfortable place to call home.</span><span>College mini project · MERN stack</span></footer>
  </div>;
}
