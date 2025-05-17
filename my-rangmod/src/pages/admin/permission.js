import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from "../../styles/admin-permission.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';

const AdminPermission = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    role: '',
    profileImage: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  });

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.status === 200) {
          const user = response.data;
          setUserData({
            name: user.name || user.username,
            username: user.username,
            role: user.role,
            profileImage: user.profile_picture || 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err.response?.status === 401) {
          router.push('/signin');
        }
      }
    };

    fetchUserData();
  }, [router]);

  const [adminUsers, setAdminUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch permission requests
  useEffect(() => {
    const fetchPermissionRequests = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/users/owner-permission-requests');
        if (response.status === 200) {
          setAdminUsers(response.data.requests);
          setTotalPages(Math.ceil(response.data.requests.length / 10));
        }
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงคำขออนุญาต:', err);
        setNotification({
          show: true,
          message: 'ไม่สามารถโหลดคำขออนุญาตได้',
          type: 'เกิดข้อผิดพลาด'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissionRequests();
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      router.push("/signin");
    } catch (err) {
      console.error('Logout error:', err);
      alert('ออกจากระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleAddOwner = () => {
    // Navigate to add owner page or open modal
    router.push("/create-owner");
  };

  const handleDeleteUserPrompt = (userId) => {
    // Show delete confirmation modal
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    // Close delete confirmation modal
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const confirmDelete = () => {
    // Remove the user from the list
    const updatedUsers = adminUsers.filter(user => user._id !== userToDelete);
    setAdminUsers(updatedUsers);
    
    // Close delete confirmation modal
    setShowDeleteModal(false);
    setUserToDelete(null);
  };
  
  const handlePermissionAction = async (action) => {
    try {
      const response = await axios.post(`/api/users/${userToUpdate._id}/handle-permission`, {
        action: action // 'accept' or 'deny'
      });

      if (response.status === 200) {
        // Update the local state
        setAdminUsers(adminUsers.filter(user => user._id !== userToUpdate._id));
        setShowRoleModal(false);
        setUserToUpdate(null);
        setNotification({
          show: true,
          message: `คำขออนุญาต${action} สำเร็จแล้ว`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการจัดการคำขออนุญาต:', err);
      setNotification({
        show: true,
        message: `ไม่สามารถ${action}คำขออนุญาตได้`,
        type: 'error'
      });
    }
  };
  
  // Filter admin users based on search query and pending status
  const filteredAdminUsers = adminUsers.filter(user => 
    user.status === 'pending' && (
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Sidebar */}
        <SidebarAdmin />
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>สวัสดี, {userData.username}</h1>
              <p>ขอให้เป็นวันที่ดี!</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <image 
                    src={userData.profileImage || 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'} 
                    alt="Profile" 
                    className={styles.profileImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png';
                    }}
                  />
                  <span className={styles.profileName}>{userData.username}</span>
                  <svg className={styles.dropdownArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  
                  {showDropdown && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownItem} onClick={handleLogout}>
                        <div className={styles.dropdownIcon}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                        </div>
                        <span>ออกจากรบบ</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.dashboardHeader}>
            <h2 className={styles.dashboardTitle}>สิทธิ์ผู้ดูแลเจ้าของระบบ</h2>
          </div>
          
          <div className={styles.searchSortContainer}>
            <div className={styles.searchContainer}>
              <div className={styles.searchIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search" 
                className={styles.searchInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className={styles.actionButtons}>
              <div className={styles.sortByContainer}>
                <span>Sort by</span>
                <div className={styles.sortIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M6 12h12"></path>
                    <path d="M9 18h6"></path>
                  </svg>
                </div>
              </div>
              <button className={styles.addUserButton} onClick={handleAddOwner}>
              เพิ่มผู้ดูแล +
              </button>
            </div>
          </div>
          
          <div className={styles.userListContainer}>
            <h3 className={styles.listTitle}>List User Request</h3>
            
            <div className={styles.tableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>ไอดี</th>
                    <th>ชื่อ</th>
                    <th>อีเมล</th>
                    <th>โทรศัพท์</th>
                    <th>วันที่ส่งคำขอ</th>
                    <th>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className={styles.loadingCell}>Loading...</td>
                    </tr>
                  ) : adminUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={styles.noDataCell}>No permission requests found</td>
                    </tr>
                  ) : (
                    adminUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{new Date(user.requestDate).toLocaleDateString()}</td>
                        <td className={styles.actions}>
                          <div className={styles.actionButtons}>
                            <button 
                              className={styles.acceptButton}
                              onClick={() => {
                                setUserToUpdate(user);
                                setShowRoleModal(true);
                              }}
                              title="คำขอทบทวน"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            </button>
                            <button 
                              className={styles.deleteButton}
                              onClick={() => handleDeleteUserPrompt(user._id)}
                              title="คำร้องขอลบ"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className={styles.pagination}>
              <button 
                className={styles.paginationButton} 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <span className={styles.paginationInfo}>
                {currentPage} of {totalPages}
              </span>
              <button 
                className={styles.paginationButton} 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Modal */}
      {showRoleModal && userToUpdate && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Handle Permission Request</h3>
              <button className={styles.closeButton} onClick={() => setShowRoleModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Review request from: {userToUpdate.name}</p>
              <p>Email: {userToUpdate.email}</p>
              <p>Phone: {userToUpdate.phone}</p>
              <p>Request Date: {new Date(userToUpdate.requestDate).toLocaleDateString()}</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.denyButton} onClick={() => handlePermissionAction('deny')}>Deny</button>
              <button className={styles.acceptButton} onClick={() => handlePermissionAction('accept')}>Accept</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <div className={styles.notificationContent}>
            <svg className={styles.notificationIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{notification.message}</span>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={() => setNotification({ show: false, message: '', type: 'success' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPermission;