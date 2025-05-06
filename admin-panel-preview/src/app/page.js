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
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', // ใช้ฟอนต์เดียวกัน
};

const cellStyle = {
  padding: '12px',
  textAlign: 'left',
  verticalAlign: 'middle',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', // ใช้ฟอนต์เดียวกัน
};

const dormData = [
  { id: 1, name: 'Hopak1', owner: 'David Jo', status: 'Available', updated: '24 Jun, 2023' },
  { id: 2, name: 'Hopak2', owner: 'Ina Hogan', status: 'Available', updated: '24 Aug, 2023' },
  { id: 3, name: 'Hopak3', owner: 'Harmon Nola', status: 'Available', updated: '18 Dec, 2023' },
  { id: 4, name: 'Hopak4', owner: 'Lena Jung', status: 'Full', updated: '8 Oct, 2023' },
  { id: 5, name: 'Hopak5', owner: 'Eula Lina', status: 'Available', updated: '15 Jun, 2023' },
  { id: 6, name: 'Hopak6', owner: 'Victoria Christ', status: 'Available', updated: '12 July, 2023' },
  { id: 7, name: 'Hopak7', owner: 'Cora Polar', status: 'Full', updated: '21 July, 2023' },
];

export default function Dashboard() {
  const [dorms, setDorms] = useState(dormData); // ใช้ useState เพื่อจัดการกับข้อมูลในตาราง

  // ฟังก์ชันสำหรับการแก้ไข
  const handleEdit = (id) => {
    console.log('Editing dorm with id:', id);
    // ที่นี่คุณสามารถทำการแก้ไขข้อมูลตามที่ต้องการ เช่นเปิด modal หรือฟอร์มแก้ไข
  };

  // ฟังก์ชันสำหรับการลบ
  const handleDelete = (id) => {
    const updatedDorms = dorms.filter(dorm => dorm.id !== id); // ลบ dorm ที่มี id ตรงกัน
    setDorms(updatedDorms); // อัพเดต state เพื่อให้ตารางแสดงข้อมูลที่ถูกลบ
    console.log('Deleted dorm with id:', id);
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
            List Dormitory
          </h2>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
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
              {dorms.map((dorm) => (
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
            </tbody>
          </table>

        </div>
      </main>
    </div>
  );
}
