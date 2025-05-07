'use client';

import React from 'react';

export default function DashboardHeader() {
  return (
    <>
      {/* Greeting Text + Account Box */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>Hello, Salman</h1>
          <p style={{ margin: 0, fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#757575' }}>Have a nice day</p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          paddingLeft: '50px',
          cursor: 'pointer',
          minWidth: '200px',
          borderLeft: '1px solid #757575',
        }}>
          <img src="/favicon.ico" alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>Salman</div>
            <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>Admin</div>
          </div>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>▼</div>
        </div>
      </div>
    </>
  );
}
