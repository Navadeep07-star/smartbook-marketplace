import React from 'react';

export default function CategoryCard({ cat, isActive, onClick }) {
  return (
    <div onClick={onClick} style={{ backgroundColor: '#ffffff', padding: '30px 20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', cursor: 'pointer', border: isActive ? '2px solid #2563eb' : '2px solid transparent', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>{cat.icon}</div>
      <div style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>{cat.name}</div>
    </div>
  );
}