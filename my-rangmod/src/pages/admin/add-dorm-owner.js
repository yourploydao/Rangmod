import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from "../../styles/admin-dashboard.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';
import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';
import User from '@/models/User';

export async function getServerSideProps(context) {
  try {
    await connectDB();
    const { userId } = context.query;
    
    // Get user data if userId is provided
    let userData = null;
    if (userId) {
      const user = await User.findById(userId).lean();
      if (user) {
        // Convert all Date objects to ISO strings and handle ObjectIds
        userData = {
          ...user,
          _id: user._id.toString(),
          dormitories: user.dormitories.map(d => d.toString()),
          resetPasswordOTPExpires: user.resetPasswordOTPExpires ? user.resetPasswordOTPExpires.toISOString() : null,
          verificationOTPExpires: user.verificationOTPExpires ? user.verificationOTPExpires.toISOString() : null,
          createdAt: user.createdAt ? user.createdAt.toISOString() : null,
          updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null
        };
      }
    }

    const dormitories = await Dormitory.find({}).lean();
    
    // Serialize dormitory data
    const serializedDormitories = dormitories.map(dormitory => ({
      ...dormitory,
      _id: dormitory._id.toString(),
      last_updated: dormitory.last_updated ? new Date(dormitory.last_updated).toISOString() : null
    }));

    return {
      props: {
        initialDormitories: serializedDormitories,
        userData: userData
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialDormitories: [],
        userData: null
      }
    };
  }
}

const OwnerDashboard = ({ initialDormitories, userData }) => {
  const router = useRouter();
  const { userId } = router.query;
  const dropdownRef = useRef(null);
  
  const [currentUser, setCurrentUser] = useState(userData);
  const [dormitories, setDormitories] = useState(initialDormitories);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.status === 200) {
          const user = response.data;
          setCurrentUser({
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

  // Add useEffect to fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        if (response.status === 200) {
          setAllUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAllUsers();
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
      alert('Failed to logout. Please try again.');
    }
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

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAssignDormitory = async (dormId) => {
    if (!userId) {
      showNotification('No user selected', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/users/assign-dormitory', {
        userId,
        dormitoryId: dormId
      });

      if (response.status === 200) {
        setCurrentUser(response.data.user);
        showNotification('Dormitory has been successfully assigned to the owner');
        // Refresh the page after successful assignment
        router.reload();
      }
    } catch (error) {
      console.error('Error assigning dormitory:', error);
      showNotification('Failed to assign dormitory. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDormitory = async (dormId) => {
    if (!userId) {
      showNotification('No user selected', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/users/remove-dormitory', {
        userId,
        dormitoryId: dormId
      });

      if (response.status === 200) {
        setCurrentUser(response.data.user);
        showNotification('Dormitory has been successfully removed from the owner');
        // Refresh the page after successful removal
        router.reload();
      }
    } catch (error) {
      console.error('Error removing dormitory:', error);
      showNotification('Failed to remove dormitory. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Function to check if dormitory is owned by other users
  const getDormitoryOwnership = (dormId) => {
    // Use userData from state instead of props to get real-time updates
    const isOwnedByTargetUser = userData?.dormitories?.includes(dormId);
    const otherOwners = allUsers.filter(user => 
      user._id !== userId && 
      user.dormitories?.includes(dormId)
    );

    if (isOwnedByTargetUser) {
      return { status: 'owned', owners: [] };
    } else if (otherOwners.length > 0) {
      return { status: 'other', owners: otherOwners };
    } else {
      return { status: 'not_owned', owners: [] };
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SidebarAdmin />
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>Hello, {currentUser?.username}</h1>
              <p>Have a nice day</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <img 
                    src={currentUser?.profileImage || 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'} 
                    alt="Profile" 
                    className={styles.profileImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png';
                    }}
                  />
                  <span className={styles.profileName}>{currentUser?.username}</span>
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
            <h2 className={styles.dashboardTitle}>
              {userData ? `Manage Dormitories for ${userData.username}` : 'Admin Dashboard'}
            </h2>
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
                  {dormitories.map((dorm, index) => {
                    const ownership = getDormitoryOwnership(dorm._id);
                    return (
                      <tr key={dorm._id}>
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
                            {userData && (
                              <>
                                {ownership.status === 'owned' && (
                                  <button
                                    className={`${styles.ownershipButton} ${styles.owned}`}
                                    onClick={() => handleRemoveDormitory(dorm._id)}
                                    disabled={loading}
                                    title={`Remove from ${userData.username}`}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    Owned by {userData.username}
                                  </button>
                                )}
                                {ownership.status === 'other' && (
                                  <button
                                    className={`${styles.ownershipButton} ${styles.other}`}
                                    disabled={true}
                                    title={`Owned by: ${ownership.owners.map(o => o.username).join(', ')}`}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="9" cy="7" r="4"></circle>
                                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    Owned by other
                                  </button>
                                )}
                                {ownership.status === 'not_owned' && (
                                  <button
                                    className={`${styles.ownershipButton} ${styles.notOwned}`}
                                    onClick={() => handleAssignDormitory(dorm._id)}
                                    disabled={loading}
                                    title={`Assign to ${userData.username}`}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                      <line x1="12" y1="5" x2="12" y2="19"></line>
                                      <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Not owned
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
      
      {/* Notification */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <div className={styles.notificationContent}>
            <svg 
              className={styles.notificationIcon} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {notification.type === 'success' ? (
                <>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </>
              )}
            </svg>
            <span className={styles.notificationMessage}>{notification.message}</span>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={() => setNotification({ show: false, message: '', type: 'success' })}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
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