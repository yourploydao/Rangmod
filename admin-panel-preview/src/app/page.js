import Image from "next/image";
import styles from "./page.module.css";
import Sidebar from '../sidebar';


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
  return (
    <div style={{ display: 'flex', backgroundColor: '#e0f2ff', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '25px', padding: '2rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          
          {/* Greeting Text */}
          <div>
            <h1 style={{ margin: 0 }}>Hello, Salman</h1>
            <p style={{ margin: 0 }}>Have a nice day</p>
          </div>
        
          {/* Account Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            minWidth: '200px'
          }}>
            <img src="/favicon.ico" alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Salman</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Admin</div>
            </div>
            <div style={{ fontSize: '18px', color: '#6b7280' }}>▼</div>
          </div>
        </div>

        {/* Dash Board */}
        <div style={{ margin: '1rem 0' }}>
          <input type="text" placeholder="Search..." style={{ padding: '8px', width: '300px' }} />
          <button style={{
            marginLeft: '1rem',
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '4px',
            border: 'none'
          }}>
            Add Dorm +
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Owner</th>
              <th>State</th>
              <th>Last update</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dormData.map((dorm) => (
              <tr key={dorm.id}>
                <td>{dorm.id}</td>
                <td>{dorm.name}</td>
                <td>{dorm.owner}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: dorm.status === 'Full' ? '#ef4444' : '#10b981',
                    color: 'white',
                    fontSize: '0.875rem',
                  }}>
                    {dorm.status}
                  </span>
                </td>
                <td>{dorm.updated}</td>
                <td>
                  ✏️ 🗑️
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}