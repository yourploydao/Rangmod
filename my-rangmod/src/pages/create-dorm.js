import React, { useState, useRef } from 'react';
import { Upload, X, Home, Users, FileText, Settings, Trash2, Mail } from 'lucide-react';
import styles from "../styles/create-dorm.module.css";
import Sidebar from "../components/sidebar-setting";

const CreateDormitoryPage = () => {
  const [rooms, setRooms] = useState([{ id: 1, name: 'Room 1' }]);
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    dormitoryName: '',
    description: '',
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
  const fileInputRef = useRef(null);

  const handleAddRoom = () => {
    const newRoom = {
      id: rooms.length + 1,
      name: `Room ${rooms.length + 1}`
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

  const removePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (photos.length < 5) {
      alert('Please upload at least 5 photos');
      return;
    }
    console.log('Form submitted', { formData, rooms, photos });
    // Submit logic would go here
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className={styles.mainWrapper}>
          {/* Top Header with User Info - Restructured to match Image 2 */}
          <div className={styles.contentHeader}>
            <div className={styles.headerLeftSection}>
              <div className={styles.greeting}>
                <h2 className={styles.greetingTitle}>Hello, Salman</h2>
                <p className={styles.greetingSubtitle}>Have a nice day</p>
              </div>
            </div>
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile}>
                  <img src="/api/placeholder/40/40" alt="Profile" className={styles.profileImage} />
                  <span className={styles.profileName}>Salman Faris</span>
                  <svg className={styles.dropdownArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Content */}
          <div className={styles.mainContent}>
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
                  placeholder="New dormitory with the whole building (New building completely renovated)"
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
                  placeholder="Parking (vehicles)&#10;Location near CMU (Backside Main Road near Soi Physics Building 34 (with private road access to the mountain))"
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
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Room Type</label>
                        <input type="text" className={styles.formInput} placeholder="Standard Room" />
                      </div>
                    </div>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Room Price</label>
                        <input type="text" className={styles.formInput} placeholder="฿ 5,000" />
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
                  + Add Another Room
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