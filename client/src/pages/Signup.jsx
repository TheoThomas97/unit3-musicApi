import { useState } from 'react';
import api from '../api';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', password:'' });
  const [err, setErr] = useState('');

 const submit = async (e) => {
  e.preventDefault();
  setErr(''); 
  try {
    const res = await api.post('/auth/signup', {
      username: form.username,
      email: form.email,
      password: form.password,
    });
    
    
    login(res.data); 
    nav('/'); 
  } catch (err) {
    console.error(err?.response?.data);
    
    const errorMsg = err?.response?.data?.error || err?.response?.data?.errors?.[0]?.msg || 'Signup failed';
    setErr(errorMsg);
  }
};


  return (
    <form onSubmit={submit} className="auth-form">
      <h2>Sign up</h2>
      <input placeholder="Username" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} required />
      <input placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
      {err && <div className="error-message">{err}</div>}
      <button type="submit">Create account</button>
    </form>
  );
}
