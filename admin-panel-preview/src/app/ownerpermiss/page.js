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

  return (
    <div style={{ display: 'flex', backgroundColor: '#e8f8ff', minHeight: '100vh', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#222B45' }}>
      <Sidebar />
      <main style={{ marginLeft: '25px', padding: '2rem', width: '100%' }}>
        <DashboardHeader />

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
              {users.map((user) => (
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
