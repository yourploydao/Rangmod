import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from "../../styles/admin-user.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';

const AdminUsers = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    role: '',
    profileImage: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  });

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

  // Fetch users with pagination and search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/users?page=${currentPage}&search=${searchQuery}`);
        setAdminUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching users:', error);
        showNotification('Error fetching users', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchQuery]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push("/signin");
    } catch (err) {
      console.error('Logout error:', err);
      showNotification('Failed to logout', 'error');
    }
  };

  const handleAddUser = () => {
    router.push("/create-user");
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleRoleClick = (user) => {
    setUserToUpdate(user);
    setShowRoleModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/users/${userToDelete}`);
      setAdminUsers(adminUsers.filter(user => user._id !== userToDelete));
      setShowDeleteModal(false);
      setUserToDelete(null);
      showNotification('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Error deleting user', 'error');
    }
  };

  const updateUserRole = async (newRole) => {
    try {
      const response = await axios.patch(`/api/users/${userToUpdate._id}`, { role: newRole });
      setAdminUsers(adminUsers.map(user => 
        user._id === userToUpdate._id ? response.data : user
      ));
      setShowRoleModal(false);
      setUserToUpdate(null);
      showNotification('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      showNotification('Error updating user role', 'error');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const cancelRoleUpdate = () => {
    setShowRoleModal(false);
    setUserToUpdate(null);
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
    setCurrentPage(1); // Reset to first page when searching
  };

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
            <h2 className={styles.dashboardTitle}>Admin Users</h2>
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
              {/* Removed Add User button */}
            </div>
          </div>
          
          <div className={styles.userListContainer}>
            <h3 className={styles.listTitle}>List Users</h3>
            
            <div className={styles.tableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th className={styles.idColumn}>No.</th>
                    <th className={styles.usernameColumn}>Username</th>
                    <th className={styles.emailColumn}>Email</th>
                    <th className={styles.roleColumn}>Role</th>
                    <th className={styles.actionColumn}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className={styles.loadingCell}>Loading...</td>
                    </tr>
                  ) : adminUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.noDataCell}>No users found</td>
                    </tr>
                  ) : (
                    adminUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className={styles.actions}>
                          <div className={styles.actionButtons}>
                            <button 
                              className={styles.roleButton}
                              onClick={() => handleRoleClick(user)}
                              title="Change Role"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </button>
                            <button 
                              className={styles.deleteButton}
                              onClick={() => handleDeleteClick(user._id)}
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
                    ))
                  )}
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
              <p>Are you sure you want to delete this user? <br></br>This action cannot be undone.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={cancelDelete}>Cancel</button>
              <button className={styles.confirmButton} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && userToUpdate && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Update User Role</h3>
              <button className={styles.closeButton} onClick={cancelRoleUpdate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Update role for user: {userToUpdate.username}</p>
              <div className={styles.roleOptions}>
                <button 
                  className={`${styles.roleOption} ${userToUpdate.role === 'user' ? styles.active : ''}`}
                  onClick={() => updateUserRole('user')}
                >
                  User
                </button>
                <button 
                  className={`${styles.roleOption} ${userToUpdate.role === 'owner' ? styles.active : ''}`}
                  onClick={() => updateUserRole('owner')}
                >
                  Owner
                </button>
                <button 
                  className={`${styles.roleOption} ${userToUpdate.role === 'admin' ? styles.active : ''}`}
                  onClick={() => updateUserRole('admin')}
                >
                  Admin
                </button>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={cancelRoleUpdate}>Cancel</button>
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

export default AdminUsers;