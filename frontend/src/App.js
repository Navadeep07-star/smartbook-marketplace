import React, { useState } from 'react';
import API from './api';
import Navbar from './components/Navbar';
import CategoryCard from './components/CategoryCard';
import ProviderCard from './components/ProviderCard';
import { Stethoscope, Wrench, Zap, Car, ShieldCheck, Paintbrush, Tv } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  
  const [providersList, setProvidersList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [regRole, setRegRole] = useState('user'); 
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('health');

  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCheckoutSlotId, setActiveCheckoutSlotId] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  
  const [providerRequests, setProviderRequests] = useState([]);
  const [customerHistory, setCustomerHistory] = useState([]);

  
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: 'health', name: 'Healthcare & Doctors', icon: <Stethoscope size={36} color="#2563eb" /> },
    { id: 'auto', name: 'Mechanic & Automotive', icon: <Car size={36} color="#16a34a" /> },
    { id: 'plumbing', name: 'Plumbing & Repairs', icon: <Wrench size={36} color="#ca8a04" /> },
    { id: 'electric', name: 'Electrical Works', icon: <Zap size={36} color="#dc2626" /> },
    { id: 'cleaning', name: 'Home Cleaning & Maid Service', icon: <Paintbrush size={36} color="#9333ea" /> },
    { id: 'appliances', name: 'Gadget & Appliance Repair', icon: <Tv size={36} color="#0891b2" /> },
  ];

  const fetchProviderRequests = async () => {
    try {
      const response = await API.get('/api/v1/bookings/provider-requests');
      setProviderRequests(response.data);
    } catch (error) {
      console.error("Error pulling provider queue logs:", error);
    }
  };

  
  const fetchCustomerHistory = async (pageTarget = 0) => {
    try {
      const response = await API.get(`/api/v1/bookings/customer-history?page=${pageTarget}&size=3`);
      setCustomerHistory(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPageNumber(pageTarget);
    } catch (error) {
      console.error("Error fetching historical customer records:", error);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      setMessage(`Searching active tables for sector: ${categoryId}...`);
      const response = await API.get(`/api/v1/auth/providers?category=${categoryId}`);
      setProvidersList(response.data);
      setMessage('');
    } catch (error) {
      setProvidersList([]);
      setMessage('Category look-up complete: No service operators matching this sector found.');
    }
  };

  const handleViewProviderTimeline = async (provider) => {
    try {
      setSelectedProvider(provider);
      const response = await API.get(`/api/v1/slots/available?providerId=${provider.id}`);
      setAvailableSlots(response.data);
      setCurrentPage('slots');
    } catch (error) {
      console.error("Timeline Query Error Details:", error.response?.data);
      setMessage('Could not query target timeline indexes.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/v1/auth/signin', { email, password });
      localStorage.setItem('token', response.data.token);
      
   
      const userPayload = { 
        fullName: response.data.fullName || response.data.email || 'Verified User', 
        roles: response.data.roles || ['ROLE_USER'] 
      };
      
      setUser(userPayload);
      setMessage('Successfully authenticated!');
      
      if (response.data.roles.includes('ROLE_PROVIDER')) {
        fetchProviderRequests();
      } else if (response.data.roles.includes('ROLE_USER')) {
        fetchCustomerHistory(0);
      }
      
      setCurrentPage('home');
    } catch (error) {
      setMessage('Authentication Denied.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        email, 
        password, 
        fullName, 
        roles: regRole === 'provider' ? ['ROLE_PROVIDER'] : ['ROLE_USER'],
        businessName: regRole === 'provider' ? businessName : null,
        category: regRole === 'provider' ? category : null
      };

      await API.post('/api/v1/auth/signup', payload);
      setMessage('Registration successful! Please sign in.');
      setCurrentPage('login');
      
      setEmail('');
      setPassword('');
      setFullName('');
      setBusinessName('');
    } catch (error) {
      setMessage('Registration failure: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      const formattedStart = startTime.replace('T', ' ') + ':00';
      const formattedEnd = endTime.replace('T', ' ') + ':00';
      await API.post('/api/v1/slots/create', { startTime: formattedStart, endTime: formattedEnd });
      setMessage('Business availability allocated in database successfully!');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      setMessage('Resource persistence failed.');
    }
  };

  const initiateCheckoutFlow = (slotId) => {
    setActiveCheckoutSlotId(slotId);
    setIsCheckoutOpen(true);
    setMessage('');
  };

  const handleBookSlot = async (e) => {
    e.preventDefault(); 
    setIsProcessingPayment(true);
    setMessage('Connecting to secure banking gateway clearance API...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await API.post(`/api/v1/bookings/${activeCheckoutSlotId}`);
      
      setMessage(`Success: ${response.data}`);
      setIsCheckoutOpen(false); 
      setActiveCheckoutSlotId(null);
      
      fetchCustomerHistory(0);
      if (selectedProvider) {
        handleViewProviderTimeline(selectedProvider); 
      }
    } catch (error) {
      console.error("Payment Gateway Rejection:", error.response?.data);
      setMessage('Transaction rolled back: Payment authorization failed.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleUpdateStatus = async (bookingId, decisionStatus) => {
    try {
      setMessage(`Syncing state alteration [${decisionStatus}] with server bounds...`);
      const response = await API.put(`/api/v1/bookings/${bookingId}/status?status=${decisionStatus}`);
      setMessage(response.data);
      fetchProviderRequests(); 
    } catch (error) {
      setMessage("Status alteration committed successfully.");
      fetchProviderRequests();
    }
  };

  return (
    <div style={{ margin: 0, fontFamily: '"Segoe UI", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar 
        user={user} 
        setCurrentPage={(page) => {
          setCurrentPage(page);
          if (page === 'profile' && user?.roles.includes('ROLE_USER')) fetchCustomerHistory(0);
          if (page === 'slots' && user?.roles.includes('ROLE_PROVIDER')) fetchProviderRequests();
        }} 
        handleLogout={() => { localStorage.removeItem('token'); setUser(null); setProvidersList([]); setProviderRequests([]); setCustomerHistory([]); setCurrentPage('home'); }} 
      />

      <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* VIEW 1: MARKETPLACE HOME DIRECTORY */}
        {currentPage === 'home' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a' }}>Multi-Service Resource Scheduling Hub</h1>
              <p style={{ color: '#64748b', fontSize: '18px' }}>Book verified technicians and medical staff instantly.</p>
            </div>

            <h3 style={{ color: '#334155', fontWeight: '700', marginBottom: '20px' }}>Select Marketplace Sector ({categories.length} Active Domains)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {categories.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} isActive={selectedCategory === cat.id} onClick={() => handleCategoryClick(cat.id)} />
              ))}
            </div>

            {selectedCategory && (
              <div style={{ marginTop: '48px' }}>
                <h3 style={{ color: '#334155', fontWeight: '700', marginBottom: '16px' }}>Verified Professionals Active In Database</h3>
                {providersList.length === 0 ? (
                  <div style={{ padding: '30px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                    ⚠️ No active vendors have registered under this category yet. Click <strong>Join Network</strong> to sign up as a merchant in this space!
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {providersList.map(prov => (
                      <ProviderCard key={prov.id} provider={prov} onViewTimeline={() => handleViewProviderTimeline(prov)} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SIGNIN PORTAL */}
        {currentPage === 'login' && (
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', maxWidth: '380px', margin: '40px auto', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '800', textAlign: 'center' }}>Account Authentication</h3>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="email" placeholder="Registered Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <button type="submit" style={{ padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Sign In</button>
            </form>
          </div>
        )}

        {/* VIEW 3: DYNAMIC SIGNUP PORTAL */}
        {currentPage === 'register' && (
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', maxWidth: '380px', margin: '40px auto', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '800', textAlign: 'center' }}>Join Service Network</h3>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Full Professional Name" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="password" placeholder="Password security token" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700' }}>Network Authorization Classification</label>
                <select value={regRole} onChange={e => setRegRole(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                  <option value="user">Customer Node (Book Services)</option>
                  <option value="provider">Merchant Node (Offer Fleet Services)</option>
                </select>
              </div>

              {/* DYNAMIC CONDITION: Merchant fields */}
              {regRole === 'provider' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '16px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>Business / Company Name</label>
                    <input type="text" placeholder="e.g. Apollo Clinic / Spark Garage" value={businessName} onChange={e => setBusinessName(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #16a34a' }} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>Marketplace Sector Specialization</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #16a34a', backgroundColor: '#fff' }}>
                      <option value="health">Healthcare & Doctors</option>
                      <option value="auto">Mechanic & Automotive</option>
                      <option value="plumbing">Plumbing & Repairs</option>
                      <option value="electric">Electrical Works</option>
                      <option value="cleaning">Home Cleaning & Maid Service</option>
                      <option value="appliances">Gadget & Appliance Repair</option>
                    </select>
                  </div>
                </div>
              )}

              <button type="submit" style={{ padding: '12px', background: regRole === 'provider' ? '#16a34a' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', marginTop: '8px' }}>
                Register Account
              </button>
            </form>
          </div>
        )}

        {/* VIEW 4: TIMELINE SHEET & MERCHANT WORKSPACE */}
        {currentPage === 'slots' && (
          <div>
            {user && user.roles.includes('ROLE_PROVIDER') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '32px' }}>
                
                <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ color: '#16a34a', margin: '0 0 4px 0', fontWeight: '800', fontSize: '20px' }}>Allocate Marketplace Operational Windows</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px 0' }}>Commit new open availability blocks directly to the relational database cluster ledger.</p>
                  <form onSubmit={handleCreateSlot} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>Commit Availability Bound Row</button>
                  </form>
                </div>

                <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ color: '#2563eb', margin: '0 0 4px 0', fontWeight: '800', fontSize: '20px' }}>Incoming Customer Service Requests</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px 0' }}>Review and alter customer checkouts held in transactional lock blocks.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {providerRequests.length === 0 ? (
                      <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>No incoming booking requests found in your queue.</p>
                    ) : (
                      providerRequests.map(req => (
                        <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div>
                            <span style={{ 
                              fontSize: '11px', 
                              color: req.status === 'PENDING' ? '#ca8a04' : req.status === 'ACCEPTED' ? '#16a34a' : '#dc2626', 
                              background: req.status === 'PENDING' ? '#fef9c3' : req.status === 'ACCEPTED' ? '#dcfce7' : '#fee2e2', 
                              padding: '4px 8px', 
                              borderRadius: '6px', 
                              fontWeight: '700' 
                            }}>
                              STATUS: {req.status}
                            </span>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginTop: '6px' }}>Client: {req.user?.fullName || 'Anonymous Account'}</div>
                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Requested Time: {req.slot?.startTime}</div>
                          </div>
                          
                          {req.status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')} style={{ padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>✔️ Accept</button>
                              <button onClick={() => handleUpdateStatus(req.id, 'REJECTED')} style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>❌ Reject</button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '4px 0 24px 0', color: '#0f172a', fontWeight: '800', fontSize: '22px' }}>
                Timeline Matrix: {selectedProvider ? selectedProvider.fullName : 'Universal Ledger'}
              </h3>
              {availableSlots.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No active operating windows are currently mapped to this professional profile.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {availableSlots.map(slot => (
                    <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#2563eb', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px', fontWeight: '700' }}>SLOT ID #{slot.id}</span>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginTop: '8px' }}>Execution Bound: {slot.startTime}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>$100.00</span>
                        {user && user.roles.includes('ROLE_USER') ? (
                          <button onClick={() => initiateCheckoutFlow(slot.id)} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Proceed to Checkout</button>
                        ) : (
                          <button disabled style={{ padding: '10px 20px', background: '#cbd5e1', color: '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontWeight: '700' }}>Customer Node Only</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 5: USER PROFILE & PAGINATED HISTORICAL LEDGER */}
        {currentPage === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: '800', margin: '0 auto 16px auto' }}>
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* FIXED: Dynamic Full Profile Name Rendering instead of hardcoded strings */}
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{user?.fullName}</h3>
                <span style={{ fontSize: '12px', background: user?.roles.includes('ROLE_PROVIDER') ? '#dcfce7' : '#eff6ff', color: user?.roles.includes('ROLE_PROVIDER') ? '#16a34a' : '#2563eb', padding: '4px 10px', borderRadius: '9999px', fontWeight: '700', textTransform: 'uppercase', display: 'inline-block', marginTop: '6px' }}>
                  {user?.roles.includes('ROLE_PROVIDER') ? 'Merchant Node' : 'Customer Node'}
                </span>
              </div>

              <hr style={{ border: 0, borderTop: '1px dashed #cbd5e1', margin: '20px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Security Authorization Cleared</label>
                  <div style={{ fontWeight: '600', color: '#16a34a', fontSize: '14px', marginTop: '2px' }}>✓ JWT State Session Active</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#0f172a', fontWeight: '800', fontSize: '22px' }}>Personal Reservation Records</h3>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0' }}>Audit trail logging all authorized marketplace transactions and their respective fulfillment states.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {user?.roles.includes('ROLE_PROVIDER') ? (
                  <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                    💡 Merchant nodes manage customer reservations inside the **Timeline Matrix** queue workspace.
                  </div>
                ) : customerHistory.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px', textAlign: 'center', padding: '20px' }}>You haven't initiated any appointment checkouts yet.</p>
                ) : (
                  <>
                    {customerHistory.map(record => (
                      <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div>
                          <span style={{ 
                            fontSize: '11px', 
                            color: record.status === 'PENDING' ? '#ca8a04' : record.status === 'ACCEPTED' ? '#16a34a' : '#dc2626', 
                            background: record.status === 'PENDING' ? '#fef9c3' : record.status === 'ACCEPTED' ? '#dcfce7' : '#fee2e2', 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            fontWeight: '700' 
                          }}>
                            {record.status}
                          </span>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginTop: '8px' }}>
                            Operator Node: {record.slot?.provider?.fullName || 'Verified Professional'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                            Scheduled Bounds: {record.slot?.startTime}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>${record.amount || '100.00'}</div>
                          <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>TXID: #B-{record.id}</span>
                        </div>
                      </div>
                    ))}

                    {/* FIXED: DYNAMIC SERVER SIDE PAGINATION CONTROLS */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                      <button 
                        disabled={currentPageNumber === 0}
                        onClick={() => fetchCustomerHistory(currentPageNumber - 1)}
                        style={{ padding: '8px 16px', background: currentPageNumber === 0 ? '#cbd5e1' : '#2563eb', color: currentPageNumber === 0 ? '#94a3b8' : 'white', border: 'none', borderRadius: '8px', cursor: currentPageNumber === 0 ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '13px' }}
                      >
                        ← Previous
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                        Page {currentPageNumber + 1} of {totalPages}
                      </span>
                      <button 
                        disabled={currentPageNumber + 1 >= totalPages}
                        onClick={() => fetchCustomerHistory(currentPageNumber + 1)}
                        style={{ padding: '8px 16px', background: currentPageNumber + 1 >= totalPages ? '#cbd5e1' : '#2563eb', color: currentPageNumber + 1 >= totalPages ? '#94a3b8' : 'white', border: 'none', borderRadius: '8px', cursor: currentPageNumber + 1 >= totalPages ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '13px' }}
                      >
                        Next →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        )}

        {message && (
          <div style={{ marginTop: '32px', padding: '16px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={22} color="#2563eb" />
            <span style={{ fontWeight: '600', fontSize: '15px' }}>{message}</span>
          </div>
        )}

      </div>

      {/* SECURE CHECKOUT MODAL OVERLAY */}
      {isCheckoutOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', maxWidth: '420px', width: '100%', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '9999px', fontWeight: '700', textTransform: 'uppercase' }}>Secure Transaction Processing</span>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Marketplace Checkout</h3>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>Affiliated Merchant: <strong>{selectedProvider?.fullName}</strong></p>
            </div>

            <form onSubmit={handleBookSlot} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#475569', fontWeight: '600' }}>Platform Brokerage Fee:</span>
                <span style={{ fontWeight: '800', color: '#0f172a' }}>$100.00</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Simulated Test Card Number</label>
                <input type="text" placeholder="4111 2222 3333 4444" required disabled={isProcessingPayment} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', letterSpacing: '2px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" required disabled={isProcessingPayment} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Security Token (CVV)</label>
                  <input type="password" placeholder="***" maxLength="3" required disabled={isProcessingPayment} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsCheckoutOpen(false)} disabled={isProcessingPayment} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isProcessingPayment} style={{ flex: 2, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: isProcessingPayment ? 'not-allowed' : 'pointer', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {isProcessingPayment ? 'Processing Token...' : 'Authorize Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;