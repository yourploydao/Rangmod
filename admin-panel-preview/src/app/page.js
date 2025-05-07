'use client';

import Image from "next/image";
import styles from "./page.module.css";
import Sidebar from '../components/sidebar';
import { useState } from 'react';
import DashboardHeader from '../components/dashboardHeader'; 

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

const initialDormData = [
  { id: 1, name: 'Hopak1', owner: 'David Jo', status: 'Available', updated: '24 Jun, 2023' },
  { id: 2, name: 'Hopak2', owner: 'Ina Hogan', status: 'Available', updated: '24 Aug, 2023' },
  { id: 3, name: 'Hopak3', owner: 'Harmon Nola', status: 'Available', updated: '18 Dec, 2023' },
  { id: 4, name: 'Hopak4', owner: 'Lena Jung', status: 'Full', updated: '8 Oct, 2023' },
  { id: 5, name: 'Hopak5', owner: 'Eula Lina', status: 'Available', updated: '15 Jun, 2023' },
  { id: 6, name: 'Hopak6', owner: 'Victoria Christ', status: 'Available', updated: '12 July, 2023' },
  { id: 7, name: 'Hopak7', owner: 'Cora Polar', status: 'Full', updated: '21 July, 2023' },
];


export default function Dashboard() {
  const [dorms, setDorms] = useState(initialDormData);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (id) => {
    console.log('Editing dorm with id:', id);
  };



  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this Dorm?');
    if (confirmed) {
      setDorms(dorms.filter(dorm => dorm.id !== id));
    }
  };

  const filteredDorms = dorms.filter(dorm =>
    dorm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dorm.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDorm, setNewDorm] = useState({
    name: '',
    owner: '',
    status: 'Available',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDorm({ ...newDorm, [name]: value });
  };
  
  const handleSubmitDorm = () => {
    const nextId = dorms.length ? Math.max(...dorms.map(d => d.id)) + 1 : 1;
    const newEntry = {
      id: nextId,
      ...newDorm,
      updated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setDorms([newEntry, ...dorms]);
    setShowAddModal(false);
    setNewDorm({ name: '', owner: '', status: 'Available' }); // reset form
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#e8f8ff', minHeight: '100vh', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#222B45' }}>
      <Sidebar />
      <main style={{ marginLeft: '25px', padding: '2rem', width: '100%' }}>
        <DashboardHeader />
        <div style={{ margin: '1rem 0 20px 0' }}>
          <h1 style={{ marginBottom: '1rem', color: '#4A85F6' }}>Admin Dashboard</h1>

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
              Add Dorm +
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
                  <h3>Add New Dormitory</h3>
                  <div style={{ margin: '10px 0' }}>
                    <label>Name:</label>
                    <input name="name" value={newDorm.name} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                  </div>
                  <div style={{ margin: '10px 0' }}>
                    <label>Owner:</label>
                    <input name="owner" value={newDorm.owner} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                  </div>
                  <div style={{ margin: '10px 0' }}>
                    <label>Status:</label>
                    <select name="status" value={newDorm.status} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
                      <option value="Available">Available</option>
                      <option value="Full">Full</option>
                    </select>
                  </div>
                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button onClick={() => setShowAddModal(false)} style={{ marginRight: '10px',background: 'Red', color: 'white', padding: '8px 12px', borderRadius: '4px', border: 'none'  }}>Cancel</button>
                    <button onClick={handleSubmitDorm} style={{ background: 'Green', color: 'white', padding: '8px 12px', borderRadius: '4px', border: 'none' }}>Add</button>
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
            List Dormitory
          </h2>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={headerCellStyle}>ID</th>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Owner</th>
                <th style={headerCellStyle}>State</th>
                <th style={headerCellStyle}>Last update</th>
                <th style={headerCellStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDorms.map((dorm) => (
                <tr key={dorm.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={cellStyle}>{dorm.id}</td>
                  <td style={cellStyle}>{dorm.name}</td>
                  <td style={cellStyle}>{dorm.owner}</td>
                  <td style={cellStyle}>
                    <span style={{
                      display: 'inline-block',
                      minWidth: '80px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: dorm.status === 'Full' ? '#FF0000' : '#6FC273',
                      color: 'white',
                      fontSize: '0.875rem',
                      textAlign: 'center',
                    }}>
                      {dorm.status}
                    </span>
                  </td>
                  <td style={cellStyle}>{dorm.updated}</td>
                  <td style={cellStyle}>
                    <span onClick={() => handleEdit(dorm.id)} style={{ cursor: 'pointer', marginRight: '10px' }}>✏️</span>
                    <span onClick={() => handleDelete(dorm.id)} style={{ cursor: 'pointer' }}>🗑️</span>
                  </td>
                </tr>
              ))}
              {filteredDorms.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ ...cellStyle, textAlign: 'center', padding: '20px' }}>
                    No dorm found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
