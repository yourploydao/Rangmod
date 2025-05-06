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

      {/* Dashboard Actions */}
      <div style={{ margin: '1rem 0 20px 0' }}>
        <h1 style={{ marginBottom: '1rem', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#4A85F6' }}>Admin Dashboard</h1>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search"
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
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
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
            Add Dorm +
          </button>
        </div>
      </div>
    </>
  );
}
