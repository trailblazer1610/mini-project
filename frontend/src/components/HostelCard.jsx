import { Link } from 'react-router-dom';
const gradients = ['card-art-one','card-art-two','card-art-three','card-art-four'];
export default function HostelCard({ hostel, index = 0 }) {
  return <article className="hostel-card">
    <div className={`card-art ${gradients[index % gradients.length]}`}><span className="gender-chip">{hostel.gender === 'female' ? '♀ Girls PG' : '♂ Boys Hostel'}</span><span className="art-building">⌂</span><span className="art-label">STAYNEST SELECT</span></div>
    <div className="card-content"><div className="card-title-row"><h3>{hostel.name}</h3><span className="rating">★ {Number(hostel.rating || 4.2).toFixed(1)}</span></div>
      <p className="muted">Near {hostel.college}</p><div className="tag-list">{(hostel.amenities || []).slice(0,4).map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
      <div className="card-bottom"><div><strong className="price">₹{Number(hostel.price).toLocaleString('en-IN')}</strong><span className="muted"> / month</span><p className="distance">↗ {hostel.distanceKm || 1} km from campus</p></div><Link className="btn btn-primary" to={`/hostels/${hostel._id || hostel.id}`}>View details</Link></div>
    </div>
  </article>;
}
