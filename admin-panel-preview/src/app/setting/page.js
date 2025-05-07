'use client';

import Sidebar from '../../components/sidebar';
import { useState } from 'react';
import DashboardHeader from '../../components/dashboardHeader';

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("Tinny Targarian");
  const [username, setUsername] = useState("t1nny");
  const [phone, setPhone] = useState("0902301234");
  const [emails, setEmails] = useState(["t1nny@gmail.com"]);

  const toggleEdit = () => {
    if (isEditing) {
      // You can handle saving data here
      console.log("Saved:", { fullName, username, phone });
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = (emailToDelete) => {
    const updatedEmails = emails.filter(email => email !== emailToDelete);
    setEmails(updatedEmails);
  };

  const [showAddEmailForm, setShowAddEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail(""); // เคลียร์ input
      setShowAddEmailForm(false); // ซ่อนฟอร์มหลังจาก save
    }
  };
  

  return (
    <div style={{ display: 'flex', backgroundColor: '#e8f8ff', minHeight: '100vh', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: '#222B45' }}>
      <Sidebar />
      <main style={{ marginLeft: '25px', padding: '2rem', width: '100%' }}>
        <DashboardHeader />

        <div style={{ background: 'linear-gradient(to right, #b8d4f4, #fff4e4)', height: '100px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}></div>

        <div style={{ backgroundColor: '#fff', borderBottomRightRadius: '12px', borderBottomLeftRadius: '12px', padding: '24px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/favicon.ico" alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '20px' }} />
              <div>
                <h2 style={{ margin: 0 }}>{fullName}</h2>
                <p style={{ margin: 0, color: '#666' }}>{emails[0]}</p>
              </div>
            </div>

            <button onClick={toggleEdit} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          {/* Inputs */}
          <div style={{ display: 'flex', gap: '50px', marginBottom: '16px', marginRight: '20px' }}>
            <div style={{ flex: 1 }}>
              <label>Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} disabled={!isEditing} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} disabled={!isEditing} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '16px', marginRight: '20px' }}>
            <label>Phone Number</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} disabled={!isEditing} style={inputStyle} />
          </div>

          {/* Email + Password Panels */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '24px' }}>
            {/* Email Panel */}
<div style={{ flex: 1 }}>
  <label>My Email Address</label>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
    {emails.map((email, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', color: '#1d4ed8' }}>@</div>
          <span style={{ marginLeft: '10px', marginRight: '20px' }}>{email}</span>
        </div>
        {isEditing && (
          <span onClick={() => handleDelete(email)} style={{ cursor: 'pointer', fontSize: '18px' }}>🗑️</span>
        )}
      </div>
    ))}

    {/* Add Email Section */}
    {isEditing && (
      <>
        {!showAddEmailForm ? (
          <button
            onClick={() => setShowAddEmailForm(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '0px',
              backgroundColor: '#f0f4fc',
              cursor: 'pointer',
              color: '#4182F9',
              alignSelf: 'flex-start'
            }}
          >
            + Add Email Address
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
            <button
              onClick={handleAddEmail}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
        )}
      </>
    )}
  </div>

  <button style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
    request permission to create a dormitory
  </button>
</div>


            {/* Reset Password Panel */}
            {isEditing && (
              <div style={{ flex: 1 }}>
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" style={inputStyle} />
                <label style={{ marginTop: '16px', display: 'block' }}>Confirm Password</label>
                <input type="password" placeholder="Confirm new password" style={inputStyle} />
                <button style={{ marginTop: '16px', padding: '10px 16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  marginTop: '6px'
};
