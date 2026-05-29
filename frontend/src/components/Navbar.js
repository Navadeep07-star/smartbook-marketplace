import React from 'react';
import { CalendarDays, LayoutDashboard, LogOut } from 'lucide-react';

function Navbar({ user, setCurrentPage, handleLogout }) {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      {/* Brand Logo */}
      <div onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
        <h2 style={{ margin: 0, color: '#1e40af', fontWeight: '900', fontSize: '24px', letterSpacing: '-0.5px' }}>
          SmartBook <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', marginLeft: '4px', verticalAlign: 'middle' }}>Marketplace</span>
        </h2>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <div onClick={() => setCurrentPage('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
          <LayoutDashboard size={18} />
          <span>Marketplace Directory</span>
        </div>
        
        {user && user.roles.includes('ROLE_PROVIDER') && (
          <div onClick={() => setCurrentPage('slots')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            <CalendarDays size={18} />
            <span>Schedule Boards</span>
          </div>
        )}
      </div>

      {/* User Actions Panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!user ? (
          <>
            <button onClick={() => setCurrentPage('login')} style={{ padding: '10px 20px', background: 'none', border: 'none', color: '#475569', fontWeight: '700', cursor: 'pointer' }}>Sign In</button>
            <button onClick={() => setCurrentPage('register')} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Join Network</button>
          </>
        ) : (
          <>
            {/* ONLY ONE BUTTON RENDERS HERE NOW */}
            <div 
              onClick={() => setCurrentPage('profile')}
              style={{ 
                background: '#eff6ff', 
                color: '#2563eb', 
                padding: '10px 20px', 
                borderRadius: '9999px', 
                fontWeight: '700', 
                fontSize: '14px',
                cursor: 'pointer',
                border: '1px solid #bfdbfe',
                transition: 'all 0.2s ease'
              }}
            >
              Hi, {user.fullName} <span style={{ fontSize: '11px', opacity: 0.8 }}>[{user.roles[0].replace('ROLE_', '')}]</span>
            </div>

            <button 
              onClick={handleLogout} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#fee2e2', 
                border: 'none', 
                borderRadius: '50%', 
                cursor: 'pointer', 
                color: '#dc2626' 
              }}
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;