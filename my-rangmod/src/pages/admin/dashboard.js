import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from "../../styles/admin-dashboard.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';
import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';

export async function getServerSideProps() {
  try {
    await connectDB();
    const dormitories = await Dormitory.find({}).lean();
    
    // Serialize dormitory data
    const serializedDormitories = dormitories.map(dormitory => ({
      ...dormitory,
      _id: dormitory._id.toString(),
      last_updated: dormitory.last_updated ? new Date(dormitory.last_updated).toISOString() : null
    }));

    return {
      props: {
        initialDormitories: serializedDormitories
      }
    };
  } catch (error) {
    console.error('Error fetching dormitories:', error);
    return {
      props: {
        initialDormitories: []
      }
    };
  }
}

const OwnerDashboard = ({ initialDormitories }) => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    role: '',
    profileImage: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  });

  const [dormitories, setDormitories] = useState(initialDormitories);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dormToDelete, setDormToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
      alert('Failed to logout. Please try again.');
    }
  };

  const handleAddDorm = () => {
    router.push("/create-dorm");
  };

  const handleEditDorm = (dormId) => {
    router.push(`/edit-dorm/${dormId}`);
  };

  const handleDeleteClick = (dormId) => {
    setDormToDelete(dormId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/dormitory/delete/${dormToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete dormitory');
      }

      // Update local state after successful deletion
      setDormitories(dormitories.filter(dorm => dorm._id !== dormToDelete));
      setShowDeleteModal(false);
      setDormToDelete(null);
      
      setNotification({
        show: true,
        message: "Dormitory deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting dormitory:', error);
      setNotification({
        show: true,
        message: "Failed to delete dormitory"
      });
    }
    
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Filter dormitories based on search query
  const filteredDormitories = dormitories.filter(dorm => 
    dorm.name_dormitory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dorm.type_dormitory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dorm.category_dormitory.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort dormitories by latest update (descending)
  const sortedDormitories = [...filteredDormitories].sort((a, b) => {
    const dateA = new Date(a.last_updated || 0);
    const dateB = new Date(b.last_updated || 0);
    return dateB - dateA;
  });
  
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
        <SidebarAdmin />
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>Hello, {userData.username}</h1>
              <p>Have a nice day</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <img 
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
                        <span>Logout</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.dashboardHeader}>
            <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>
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
                onChange={handleSearchChange}
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
              <button className={styles.addDormButton} onClick={handleAddDorm}>
                Add Dorm
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <div className={styles.dormListContainer}>
            <h3 className={styles.listTitle}>List Dormitory</h3>
            
            <div className={styles.tableContainer}>
              <table className={styles.dormTable}>
                <thead>
                  <tr>
                    <th className={styles.idColumn}>No.</th>
                    <th className={styles.nameColumn}>Name</th>
                    <th className={styles.typeColumn}>Type</th>
                    <th className={styles.categoryColumn}>Category</th>
                    <th className={styles.updateColumn}>Last update</th>
                    <th className={styles.actionColumn}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDormitories.map((dorm, index) => (
                    <tr 
                      key={dorm._id}
                      className={styles.dormRow}
                      onClick={() => router.push(`/details/${dorm._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <div className={styles.dormName}>
                          {dorm.name_dormitory}
                          <div className={styles.dormCode}>{dorm.type_dormitory}</div>
                        </div>
                      </td>
                      <td>{dorm.type_dormitory}</td>
                      <td>{dorm.category_dormitory}</td>
                      <td>{new Date(dorm.last_updated).toLocaleDateString()}</td>
                      <td className={styles.actions}>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.editButton} 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click when clicking edit
                              handleEditDorm(dorm._id);
                            }}
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button 
                            className={styles.deleteButton}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click when clicking delete
                              handleDeleteClick(dorm._id);
                            }}
                            title="Delete"
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
              <h3>Confirm Deletion</h3>
              <button className={styles.closeButton} onClick={cancelDelete}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete this dormitory? <br></br>This action cannot be undone.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={cancelDelete}>Cancel</button>
              <button className={styles.confirmButton} onClick={confirmDelete}>Delete</button>
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