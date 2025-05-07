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

// 🟢 ข้อมูลใหม่: ตรงกับ attributes จริงๆ
const userData = [
  { id: 1, username: 'Owner1', email: 'Owner1@example.com'},
  { id: 2, username: 'Owner2', email: 'Owner2@example.com'},
  { id: 3, username: 'Owner3', email: 'Owner3@example.com'},
  { id: 4, username: 'Owner4', email: 'Owner4@example.com'},
  { id: 5, username: 'Owner5', email: 'Owner5@example.com'},
  { id: 6, username: 'Owner6', email: 'Owner6@example.com'},
  { id: 7, username: 'Owner7', email: 'Owner7@example.com'},
];

export default function Dashboard() {
  const [users, setUsers] = useState(userData);
  const [searchQuery, setSearchQuery] = useState(""); 

  const handleEdit = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    console.log('Deleted user with id:', id);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    console.log('Deleted user with id:', id);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#e8f8ff', minHeight: '100vh', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#222B45' }}>
      <Sidebar />
      <main style={{ marginLeft: '25px', padding: '2rem', width: '100%' }}>
        <DashboardHeader />
        <div style={{ margin: '1rem 0 20px 0' }}>
        <h1 style={{ marginBottom: '1rem', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#4A85F6' }}>Admin Owner Permissions</h1>

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
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
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

          <button style={{
            marginLeft: '1rem',
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '4px',
            border: 'none',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          }}>
            Add Owner +
          </button>
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
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          }}>
            Owner Permissions
          </h2>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={headerCellStyle}>ID</th>
                <th style={headerCellStyle}>Username</th>
                <th style={headerCellStyle}>Email</th>
                <th style={headerCellStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
            {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={cellStyle}>{user.id}</td>
                  <td style={cellStyle}>{user.username}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>
                    <span onClick={() => handleEdit(user.id)} style={{ cursor: 'pointer', marginRight: '10px', background: '#89D94C', padding: '5px',borderRadius: '10px', }}>Accept</span>
                    <span onClick={() => handleDelete(user.id)} style={{ cursor: 'pointer',background: '#FF7F7F', padding: '5px',borderRadius: '10px', }}>Deny</span>
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
