import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Trash2, MapPin } from 'lucide-react';
import styles from "../styles/create-dorm.module.css";
import Sidebar from "../components/sidebar-setting-admin";
import SidebarAdmin from '@/components/sidebar-setting-admin';

const CreateDormitoryPage = () => {
  const [rooms, setRooms] = useState([{ 
    id: 1, 
    name: 'Room 1',
    type: '',
    price: '',
    size: '',
    beds: '',
    photos: []
  }]);
  const [photos, setPhotos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const roomFileInputRefs = useRef({});
  
  const [formData, setFormData] = useState({
    dormitoryName: '',
    description: '',
    location: '',
    facilities: {
      wifi: false,
      parking: false,
      laundry: false,
      security: false,
      kitchen: false,
      tv: false,
      airConditioner: false,
      heater: false,
    }
  });
  
  const userData = {
    username: "Salman Faris"
  };
  
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
    setShowDropdown(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddRoom = () => {
    const newRoom = {
      id: rooms.length + 1,
      name: `Room ${rooms.length + 1}`,
      type: '',
      price: '',
      size: '',
      beds: '',
      photos: []
    };
    setRooms([...rooms, newRoom]);
  };

  const handleRemoveRoom = (id) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(room => room.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoomInputChange = (id, field, value) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      facilities: {
        ...formData.facilities,
        [name]: checked
      }
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Create URLs for previews
      const newPhotos = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      
      // Limit to 10 photos total
      const updatedPhotos = [...photos, ...newPhotos].slice(0, 10);
      setPhotos(updatedPhotos);
    }
  };

  const handleRoomPhotoUpload = (roomId, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPhoto = {
        id: Date.now() + Math.random(),
        name: files[0].name,
        url: URL.createObjectURL(files[0])
      };
      
      setRooms(rooms.map(room => 
        room.id === roomId 
          ? { ...room, photos: [...room.photos, newPhoto].slice(0, 5) } 
          : room
      ));
    }
  };

  const removePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const removeRoomPhoto = (roomId, photoId) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, photos: room.photos.filter(photo => photo.id !== photoId) } 
        : room
    ));
  };

  const handleMapSelect = () => {
    // This is a mock function - in reality, you'd integrate with Google Maps API
    setMapLocation({
      address: "Sample Location, Kahibah",
      lat: 15.123,
      lng: 102.456
    });
    setShowMapModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (photos.length < 5) {
      alert('Please upload at least 5 photos of the dormitory');
      return;
    }
    
    // Validate all rooms have at least one photo
    const roomsWithoutPhotos = rooms.filter(room => room.photos.length === 0);
    if (roomsWithoutPhotos.length > 0) {
      alert(`Please upload at least one photo for each room. ${roomsWithoutPhotos.map(r => r.name).join(', ')} missing photos.`);
      return;
    }
    
    if (!mapLocation) {
      alert('Please select a location on the map');
      return;
    }
    
    console.log('Form submitted', { formData, rooms, photos, mapLocation });
    // Submit logic would go here
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Use the imported Sidebar component */}
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

          {/* Main Form Content */}
          <div className={styles.formSection}>
            <h1 className={styles.contentTitle}>Admin Dashboard</h1>
            
            <div className={styles.formContainer}>
              <h2 className={styles.sectionTitle}>Dormitory details section.</h2>
              
              {/* Dormitory Name */}
              <div className={styles.formGroup}>
                <label htmlFor="dormitoryName" className={styles.formLabel}>Name Of Dormitory</label>
                <input
                  type="text"
                  id="dormitoryName"
                  name="dormitoryName"
                  className={styles.formInput}
                  value={formData.dormitoryName}
                  onChange={handleInputChange}
                  placeholder="Name of dormitory"
                />
              </div>

              {/* Dormitory Photos */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Dormitory Photos (5-10 photos required)</label>
                <div className={styles.photoGallery}>
                  {/* Display uploaded photos */}
                  {photos.map(photo => (
                    <div key={photo.id} className={styles.photoPreview}>
                      <img src={photo.url} alt={photo.name} />
                      <button 
                        type="button" 
                        onClick={() => removePhoto(photo.id)}
                        className={styles.removePhotoBtn}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload button (only show if less than 10 photos) */}
                  {photos.length < 10 && (
                    <div 
                      className={styles.photoUploadArea}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Upload size={24} className={styles.uploadIcon} />
                      <span className={styles.uploadText}>Upload Photos</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className={styles.hiddenInput}
                        onChange={handleFileUpload}
                        accept="image/*"
                        multiple
                      />
                    </div>
                  )}
                </div>
                <div className={styles.photoCounter}>
                  {photos.length}/10 photos uploaded ({photos.length < 5 ? `${5 - photos.length} more required` : 'minimum requirement met'})
                </div>
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  className={styles.formTextarea}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Description of the dormitory"
                />
              </div>

              {/* Facilities */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Facilities</label>
                <div className={styles.facilitiesGrid}>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="wifi"
                      name="wifi"
                      checked={formData.facilities.wifi}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="wifi" className={styles.checkboxLabel}>WiFi</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="parking"
                      name="parking"
                      checked={formData.facilities.parking}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="parking" className={styles.checkboxLabel}>Parking</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="laundry"
                      name="laundry"
                      checked={formData.facilities.laundry}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="laundry" className={styles.checkboxLabel}>Laundry</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="security"
                      name="security"
                      checked={formData.facilities.security}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="security" className={styles.checkboxLabel}>Security</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="kitchen"
                      name="kitchen"
                      checked={formData.facilities.kitchen}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="kitchen" className={styles.checkboxLabel}>Kitchen</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="tv"
                      name="tv"
                      checked={formData.facilities.tv}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="tv" className={styles.checkboxLabel}>TV</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="airConditioner"
                      name="airConditioner"
                      checked={formData.facilities.airConditioner}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="airConditioner" className={styles.checkboxLabel}>Air Conditioner</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="heater"
                      name="heater"
                      checked={formData.facilities.heater}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="heater" className={styles.checkboxLabel}>Heater</label>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location</label>
                <div className={styles.mapContainer}>
                  {mapLocation ? (
                    <>
                      <div className={styles.mapPreview}>
                        <img 
                          src="/api/placeholder/700/150" 
                          alt="Map location" 
                          className={styles.mapImage}
                        />
                        <div className={styles.mapOverlay}>
                          <MapPin size={32} className={styles.mapPinIcon} />
                        </div>
                      </div>
                      <div className={styles.mapAddress}>
                        <MapPin size={16} className={styles.mapPinSmall} />
                        <span>{mapLocation.address}</span>
                      </div>
                    </>
                  ) : (
                    <div 
                      className={styles.mapSelectArea}
                      onClick={() => setShowMapModal(true)}
                    >
                      <MapPin size={24} className={styles.mapIcon} />
                      <span className={styles.mapText}>Select Location on Map</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Modal */}
              {showMapModal && (
                <div className={styles.modalOverlay}>
                  <div className={styles.mapModal}>
                    <div className={styles.modalHeader}>
                      <h3>Select Location</h3>
                      <button 
                        className={styles.closeModalBtn}
                        onClick={() => setShowMapModal(false)}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className={styles.modalBody}>
                      <div className={styles.modalMapContainer}>
                        <img 
                          src="/api/placeholder/600/300" 
                          alt="Google Maps" 
                          className={styles.modalMapImage} 
                        />
                        <div className={styles.mapMarker}>
                          <MapPin size={32} className={styles.mapPinIcon} />
                        </div>
                      </div>
                      <div className={styles.modalActions}>
                        <button 
                          className={styles.cancelBtn}
                          onClick={() => setShowMapModal(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className={styles.saveLocationBtn}
                          onClick={handleMapSelect}
                        >
                          Save Location
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Room Sections */}
              <div className={styles.sectionDivider}>
                <h3 className={styles.sectionTitle}>Room Details</h3>
              </div>

              {rooms.map((room) => (
                <div key={room.id} className={styles.roomSection}>
                  <div className={styles.roomHeader}>
                    <h4 className={styles.roomTitle}>{room.name}</h4>
                    <button
                      type="button"
                      className={styles.removeRoomButton}
                      onClick={() => handleRemoveRoom(room.id)}
                      disabled={rooms.length === 1}
                    >
                      <Trash2 size={16} />
                      Remove Room
                    </button>
                  </div>
                  
                  {/* Room Photos */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Your Room Photos</label>
                    <div className={styles.photoGallery}>
                      {/* Display uploaded room photos */}
                      {room.photos.map(photo => (
                        <div key={photo.id} className={styles.photoPreview}>
                          <img src={photo.url} alt={photo.name} />
                          <button 
                            type="button" 
                            onClick={() => removeRoomPhoto(room.id, photo.id)}
                            className={styles.removePhotoBtn}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      
                      {/* Upload button for room photos */}
                      {room.photos.length < 5 && (
                        <div 
                          className={styles.photoUploadArea}
                          onClick={() => roomFileInputRefs.current[`room-${room.id}`].click()}
                        >
                          <Upload size={24} className={styles.uploadIcon} />
                          <span className={styles.uploadText}>Change Image</span>
                          <input
                            type="file"
                            ref={el => roomFileInputRefs.current[`room-${room.id}`] = el}
                            className={styles.hiddenInput}
                            onChange={(e) => handleRoomPhotoUpload(room.id, e)}
                            accept="image/*"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Room Type</label>
                        <input 
                          type="text" 
                          className={styles.formInput} 
                          placeholder="Single room" 
                          value={room.type}
                          onChange={(e) => handleRoomInputChange(room.id, 'type', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Room Price (per month)</label>
                        <input 
                          type="text" 
                          className={styles.formInput} 
                          placeholder="฿ 5,000" 
                          value={room.price}
                          onChange={(e) => handleRoomInputChange(room.id, 'price', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Room Size (meter)</label>
                        <input 
                          type="text" 
                          className={styles.formInput} 
                          placeholder="22" 
                          value={room.size}
                          onChange={(e) => handleRoomInputChange(room.id, 'size', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Number of Beds</label>
                        <input 
                          type="text" 
                          className={styles.formInput} 
                          placeholder="1" 
                          value={room.beds}
                          onChange={(e) => handleRoomInputChange(room.id, 'beds', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className={styles.addRoomContainer}>
                <button
                  type="button"
                  className={styles.addRoomButton}
                  onClick={handleAddRoom}
                >
                  + Add room
                </button>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.createButton}
                  onClick={handleSubmit}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDormitoryPage;