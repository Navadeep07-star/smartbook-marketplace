import React from 'react';
import { Star, Building2 } from 'lucide-react';

export default function ProviderCard({ provider, onViewTimeline }) {
  return (
    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{provider.fullName}</h4>
          <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Building2 size={14} /> {provider.businessName || 'Independent Contractor'}
          </div>
        </div>
        <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={12} fill="#d97706" /> {provider.rating ? provider.rating.toFixed(1) : '5.0'}
        </span>
      </div>
      <button onClick={onViewTimeline} style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
        View Dynamic Schedule Timeline
      </button>
    </div>
  );
}