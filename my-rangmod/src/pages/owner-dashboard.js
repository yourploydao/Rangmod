import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../styles/owner-dashboard.module.css";
import SidebarOwner from '@/components/sidebar-setting-owner';

const OwnerDashboard = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  // Mock user data - in a real app this would come from a database or context
  const [userData, setUserData] = useState({
    fullName: 'Benny Targarian',
    username: 'Benny',
    role: 'Dorm Owner',
    profileImage: '/assets/owner1.jpeg'
  });

  // Mock dormitory data
  const [dormitories, setDormitories] = useState([
    {
      id: 1,
      name: 'Hopak1',
      code: '101/999',
      owner: 'David Jo',
      state: 'Available',
      lastUpdate: '24 Jun, 2023'
    }
  ]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dormToDelete, setDormToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '' });
  
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = () => {
    // In a real app, this would clear auth state and redirect
    alert("Logging out...");
    router.push("/login");
  };

  const handleEditDorm = (dormId) => {
    router.push(`/edit-dorm/${dormId}`);
  };

  const handleDeleteClick = (dormId) => {
    setDormToDelete(dormId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would make an API call to delete the dorm
    setDormitories(dormitories.filter(dorm => dorm.id !== dormToDelete));
    setShowDeleteModal(false);
    setDormToDelete(null);
    
    // Show notification
    setNotification({
      show: true,
      message: "ลบหอพักเรียบร้อยแล้ว"
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDormToDelete(null);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
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
        <SidebarOwner />
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>สวัสดี, {userData.username}</h1>
              <p>ขอให้มีวันที่ดีนะ!</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <image src={userData.profileImage} alt="Profile" className={styles.profileImage} />
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
                        <span>ออกจากระบบ</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.dashboardHeader}>
            <h2 className={styles.dashboardTitle}>หน้าจัดการสำหรับเจ้าของที่พัก</h2>
          </div>
          
          <div className={styles.dormListContainer}>
            <h3 className={styles.listTitle}>แสดงรายการที่พักทั้งหมด</h3>
            
            <div className={styles.tableContainer}>
              <table className={styles.dormTable}>
                <thead>
                  <tr>
                    <th className={styles.idColumn}>ไอดี</th>
                    <th className={styles.nameColumn}>ชื่อที่พัก</th>
                    <th className={styles.ownerColumn}>เจ้าของ</th>
                    <th className={styles.stateColumn}>สถานะ</th>
                    <th className={styles.updateColumn}>อัปเดตล่าสุด</th>
                    <th className={styles.actionColumn}>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {dormitories.map((dorm) => (
                    <tr key={dorm.id}>
                      <td>{dorm.id}</td>
                      <td>
                        <div className={styles.dormName}>
                          {dorm.name}
                          <div className={styles.dormCode}>{dorm.code}</div>
                        </div>
                      </td>
                      <td>{dorm.owner}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[dorm.state.toLowerCase()]}`}>
                          {dorm.state}
                        </span>
                      </td>
                      <td>{dorm.lastUpdate}</td>
                      <td className={styles.actions}>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.editButton} 
                            onClick={() => handleEditDorm(dorm.id)}
                            title="แก้ไข"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button 
                            className={styles.deleteButton}
                            onClick={() => handleDeleteClick(dorm.id)}
                            title="ลบ"
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
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={styles.pagination}>
              <button 
                className={styles.paginationButton} 
                onClick={goToPreviousPage}
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
                onClick={goToNextPage}
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
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>ยืนยันการลบข้อมูล</h3>
              <button className={styles.closeButton} onClick={cancelDelete}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>คุณแน่ใจหรือไม่ว่าต้องการลบหอพักนี้? <br></br>การลบนี้ไม่สามารถยกเลิกหรือกู้คืนได้
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.confirmButton} onClick={confirmDelete}>Delete</button>
              <button className={styles.cancelButton} onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification.show && (
        <div className={styles.notification}>
          <div className={styles.notificationContent}>
            <svg className={styles.notificationIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{notification.message}</span>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={() => setNotification({ show: false, message: '' })}
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

export default OwnerDashboard;