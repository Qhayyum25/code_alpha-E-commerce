import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../utils/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useApp();
  const [form,    setForm]    = useState({ name: user?.name || '', email: user?.email || '' });
  const [addr,    setAddr]    = useState({ ...user?.address });
  const [passForm,setPassForm]= useState({ current: '', newPass: '', confirm: '' });
  const [tab,     setTab]     = useState('profile');
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const show = (ok, text) => { ok ? setMsg(text) : setError(text); setTimeout(() => { setMsg(''); setError(''); }, 3000); };

  const handleProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.put('/auth/profile', { name: form.name, email: form.email, address: addr });
      show(true, 'Profile updated!');
    } catch (err) { show(false, err.response?.data?.message || 'Update failed.'); }
    finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) { show(false, 'Passwords do not match.'); return; }
    if (passForm.newPass.length < 6) { show(false, 'Min 6 characters.'); return; }
    setLoading(true);
    try {
      await api.put('/auth/profile', { password: passForm.newPass });
      show(true, 'Password changed! Please log in again.');
      setTimeout(() => logout(), 2000);
    } catch (err) { show(false, err.response?.data?.message || 'Failed.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="profile-page container">
      <h1 className="profile-title">My Account</h1>

      <div className="profile-layout">
        {/* Sidebar */}
        <nav className="profile-nav">
          <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <p className="profile-name">{user?.name}</p>
          <p className="profile-email">{user?.email}</p>
          <div className="divider" style={{margin:'16px 0'}} />
          {['profile','address','password'].map(t => (
            <button key={t} className={`profile-nav-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <div className="profile-panel">
          {msg   && <div className="success-msg">{msg}</div>}
          {error && <div className="error-msg">{error}</div>}

          {/* Profile tab */}
          {tab === 'profile' && (
            <form className="profile-form" onSubmit={handleProfile}>
              <h2 className="panel-title">Personal Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
              </div>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Address tab */}
          {tab === 'address' && (
            <form className="profile-form" onSubmit={handleProfile}>
              <h2 className="panel-title">Shipping Address</h2>
              <div className="form-grid-2">
                {[['street','Street Address','123 Main St','full'],['city','City','New York',''],['state','State / Province','NY',''],['zip','ZIP Code','10001',''],['country','Country','United States','']].map(([key, label, ph, cls]) => (
                  <div key={key} className={`form-group ${cls}`}>
                    <label>{label}</label>
                    <input value={addr[key]||''} onChange={e=>setAddr(a=>({...a,[key]:e.target.value}))} placeholder={ph} />
                  </div>
                ))}
              </div>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save Address'}
              </button>
            </form>
          )}

          {/* Password tab */}
          {tab === 'password' && (
            <form className="profile-form" onSubmit={handlePassword}>
              <h2 className="panel-title">Change Password</h2>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={passForm.newPass} onChange={e=>setPassForm(p=>({...p,newPass:e.target.value}))} placeholder="Min 6 characters" required />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" value={passForm.confirm} onChange={e=>setPassForm(p=>({...p,confirm:e.target.value}))} placeholder="Repeat password" required />
              </div>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Changing…' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
