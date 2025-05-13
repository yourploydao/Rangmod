import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../styles/addmin-permission.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';

const AdminPermission = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  // Mock user data - in a real app this would come from a database or context
  const [userData, setUserData] = useState({
    fullName: 'Addmin Targarian',
    username: 'Admin',
    role: 'Admin',
    profileImage: '/assets/admin1.jpeg'
  });

  // Mock admin users data
  const [adminUsers, setAdminUsers] = useState([
    {
      id: 1,
      username: 'onwer1',
      email: 'onwer1@gmail.com',
      lastUpdate: '24 Jun, 2023',
      status: 'pending'
    },
    {
      id: 2,
      username: 'onwer2',
      email: 'onwer2@gmail.com',
      lastUpdate: '24 Aug, 2023',
      status: 'pending'
    },
    {
      id: 3,
      username: 'onwer3',
      email: 'onwer3@gmail.com',
      lastUpdate: '18 Dec, 2023',
      status: 'pending'
    }
  ]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for permission modal
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = () => {
    // In a real app, this would clear auth state and redirect
    router.push("/login");
  };

  const handleAddOwner = () => {
    // Navigate to add owner page or open modal
    router.push("/create-owner");
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowPermissionModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePermissionAction = (action) => {
    // Update the user's status based on the action
    const updatedUsers = adminUsers.map(user => 
      user.id === selectedUser.id 
        ? { ...user, status: action === 'accept' ? 'accepted' : 'denied' }
        : user
    ).filter(user => user.status === 'pending'); // Only show pending requests
    
    setAdminUsers(updatedUsers);
    setShowPermissionModal(false);
    setSelectedUser(null);
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
    const updatedUsers = adminUsers.filter(user => user.id !== userToDelete);
    setAdminUsers(updatedUsers);
    
    // Close delete confirmation modal
    setShowDeleteModal(false);
    setUserToDelete(null);
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
              <h1>Hello, {userData.username}</h1>
              <p>Have a nice day</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <img src="/assets/admin1.jpeg" alt="Profile" className={styles.profileImage} />
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
            <h2 className={styles.dashboardTitle}>Admin Owner Permissions</h2>
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
              <button className={styles.addUserButton} onClick={handleAddOwner}>
                Add Owner +
              </button>
            </div>
          </div>
          
          <div className={styles.userListContainer}>
            <h3 className={styles.listTitle}>List User Request</h3>
            
            <div className={styles.tableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Last update</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.lastUpdate}</td>
                      <td className={styles.actions}>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.editButton} 
                            onClick={() => handleEditUser(user)}
                            title="Edit Permissions"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button 
                            className={styles.deleteButton} 
                            onClick={() => handleDeleteUserPrompt(user.id)}
                            title="Delete User"
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
      {showPermissionModal && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.permissionModalContainer}>
            <div className={styles.permissionModalHeader}>
              <h2>Edit User Permissions</h2>
              <button 
                className={styles.permissionModalCloseButton} 
                onClick={() => setShowPermissionModal(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.permissionModalContent}>
              <div className={styles.userDetails}>
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Last Update:</strong> {selectedUser.lastUpdate}</p>
              </div>
              <div className={styles.permissionActions}>
                <button 
                  className={styles.acceptButton}
                  onClick={() => handlePermissionAction('accept')}
                >
                  Accept
                </button>
                <button 
                  className={styles.denyButton}
                  onClick={() => handlePermissionAction('deny')}
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <p>Are you sure you want to delete this owner? <br></br>This action cannot be undone.</p>
            </div>
                          <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={cancelDelete}>Cancel</button>
              <button className={styles.confirmButton} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPermission;