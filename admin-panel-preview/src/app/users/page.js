'use client';

import Sidebar from '../../components/sidebar';
import { useState } from 'react';
import DashboardHeader from '../../components/dashboardHeader';

const headerCellStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '2px solid #d1d5db',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
};

const cellStyle = {
  padding: '12px',
  textAlign: 'left',
  verticalAlign: 'middle',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
};

// User data
const userData = [
  { id: 1, username: 'Hopak1', email: 'hopak1@example.com', lastupdate: '2024-12-01 14:23' },
  { id: 2, username: 'Hopak2', email: 'hopak2@example.com', lastupdate: '2024-12-03 09:55' },
  { id: 3, username: 'Hopak3', email: 'hopak3@example.com', lastupdate: '2025-01-10 18:30' },
  { id: 4, username: 'Hopak4', email: 'hopak4@example.com', lastupdate: '2025-02-15 08:12' },
  { id: 5, username: 'Hopak5', email: 'hopak5@example.com', lastupdate: '2025-03-01 21:45' },
  { id: 6, username: 'Hopak6', email: 'hopak6@example.com', lastupdate: '2025-04-20 11:20' },
  { id: 7, username: 'Hopak7', email: 'hopak7@example.com', lastupdate: '2025-05-01 07:00' },
];

export default function UserPage() {
  const [users, setUsers] = useState(userData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    lastupdate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmitUser = () => {
    const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newEntry = {
      id: nextId,
      ...newUser,
      lastupdate: new Date().toLocaleString(),
    };
    setUsers([newEntry, ...users]);
    setShowAddModal(false);
    setNewUser({ username: '', email: '', lastupdate: '' });
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      setUsers(users.filter(user => user.id !== id));
    }
  };
  

  return (
    <div style={{ display: 'flex', backgroundColor: '#e8f8ff', minHeight: '100vh', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#222B45' }}>
      <Sidebar />
      <main style={{ marginLeft: '25px', padding: '2rem', width: '100%' }}>
        <DashboardHeader />
        <div style={{ margin: '1rem 0 20px 0' }}>
          <h1 style={{ marginBottom: '1rem', color: '#4A85F6' }}>User Management</h1>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                height: '25px',
                flex: 1,
                padding: '8px',
                minWidth: '0',
                background: 'url(/favicon.ico) no-repeat 10px center',
                backgroundSize: '15px 15px',
                paddingLeft: '36px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '10px',
                outline: 'none',
              }}
            />
            <button style={{
              marginLeft: '1rem',
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
            }}>
              Sort by
              <img
                src="/favicon.ico"
                alt="Sort"
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  marginLeft: '10px',
                  verticalAlign: 'middle'
                }}
              />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                marginLeft: '1rem',
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '4px',
                border: 'none',
              }}
            >
              Add User +
            </button>

            {showAddModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                justifyContent: 'center', alignItems: 'center', zIndex: 999,
              }}>
                <div style={{
                  backgroundColor: 'white', padding: '2rem', borderRadius: '10px',
                  width: '400px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}>
                  <h3>Add New User</h3>
                  <div style={{ margin: '10px 0' }}>
                    <label>Username:</label>
                    <input name="username" value={newUser.username} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                  </div>
                  <div style={{ margin: '10px 0' }}>
                    <label>Email:</label>
                    <input name="email" value={newUser.email} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                  </div>
                  <div style={{ margin: '10px 0' }}>
                    <label>Last Update:</label>
                    <input name="lastupdate" value={newUser.lastupdate} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                  </div>
                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button onClick={() => setShowAddModal(false)} style={{ marginRight: '10px', background: 'Red', color: 'white', padding: '8px 12px', borderRadius: '4px', border: 'none' }}>Cancel</button>
                    <button onClick={handleSubmitUser} style={{ background: 'Green', color: 'white', padding: '8px 12px', borderRadius: '4px', border: 'none' }}>Add</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <h2 style={{
            margin: 0,
            marginBottom: '16px',
            fontSize: '1.25rem',
            fontWeight: '600',
            paddingLeft: '10px',
            paddingTop: '10px',
          }}>
            User List
          </h2>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={headerCellStyle}>ID</th>
                <th style={headerCellStyle}>Username</th>
                <th style={headerCellStyle}>Email</th>
                <th style={headerCellStyle}>Last Update</th>
                <th style={headerCellStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={cellStyle}>{user.id}</td>
                  <td style={cellStyle}>{user.username}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>{user.lastupdate}</td>
                  <td style={cellStyle}>
                    <span onClick={() => alert('Edit user')} style={{ cursor: 'pointer', marginRight: '10px' }}>✏️</span>
                    <span onClick={() => handleDeleteUser(user.id)} style={{ cursor: 'pointer' }}>🗑️</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
