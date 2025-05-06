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
  { id: 1, username: 'Hopak1', email: 'hopak1@example.com', lastupdate: '2024-12-01 14:23' },
  { id: 2, username: 'Hopak2', email: 'hopak2@example.com', lastupdate: '2024-12-03 09:55' },
  { id: 3, username: 'Hopak3', email: 'hopak3@example.com', lastupdate: '2025-01-10 18:30' },
  { id: 4, username: 'Hopak4', email: 'hopak4@example.com', lastupdate: '2025-02-15 08:12' },
  { id: 5, username: 'Hopak5', email: 'hopak5@example.com', lastupdate: '2025-03-01 21:45' },
  { id: 6, username: 'Hopak6', email: 'hopak6@example.com', lastupdate: '2025-04-20 11:20' },
  { id: 7, username: 'Hopak7', email: 'hopak7@example.com', lastupdate: '2025-05-01 07:00' },
];

export default function Dashboard() {
  const [users, setUsers] = useState(userData);

  const handleEdit = (id) => {
    console.log('Editing user with id:', id);
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
            User List
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
                <th style={headerCellStyle}>Last update</th>
                <th style={headerCellStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={cellStyle}>{user.id}</td>
                  <td style={cellStyle}>{user.username}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>{user.lastupdate}</td>
                  <td style={cellStyle}>
                    <span onClick={() => handleEdit(user.id)} style={{ cursor: 'pointer', marginRight: '10px' }}>✏️</span>
                    <span onClick={() => handleDelete(user.id)} style={{ cursor: 'pointer' }}>🗑️</span>
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
