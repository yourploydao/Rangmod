import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Trash2, MapPin } from 'lucide-react';
import { useRouter } from 'next/router';
import styles from "../../styles/create-dorm.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';
import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';
import Facility from '@/models/Facility';
import Room from '@/models/Room';

export async function getServerSideProps({ params }) {
  try {
    await connectDB();
    
    // Fetch dormitory data
    const dormitory = await Dormitory.findById(params.id).lean();
    if (!dormitory) {
      return {
        notFound: true
      };
    }

    // Fetch facility data
    const facility = await Facility.findOne({ dormitoryID: params.id }).lean();

    // Fetch rooms data
    const rooms = await Room.find({ dormitoryID: params.id }).lean();

    // Convert rooms to the format expected by the component
    const formattedRooms = rooms.map(room => ({
      id: room._id.toString(),
      name: `Room ${room._id.toString().slice(-4)}`,
      type: room.room_type || '',
      price: room.price || '',
      size: room.room_size || '',
      beds: '1', // Default value since it's not in schema
      photos: room.room_image ? room.room_image.map((url, index) => ({
        id: `${room._id}-${index}`,
        name: `Room Image ${index + 1}`,
        url: url,
        public_id: url // Using URL as public_id since it's not stored separately
      })) : []
    }));

    // Convert dormitory images to the format expected by the component
    const formattedImages = dormitory.images ? dormitory.images.map((url, index) => ({
      id: `dorm-${index}`,
      name: `Dormitory Image ${index + 1}`,
      url: url,
      public_id: url // Using URL as public_id since it's not stored separately
    })) : [];

    return {
      props: {
        dormitory: {
          ...dormitory,
          _id: dormitory._id.toString(),
          last_updated: dormitory.last_updated ? new Date(dormitory.last_updated).toISOString() : null
        },
        facility: facility ? {
          ...facility,
          _id: facility._id.toString(),
          dormitoryID: facility.dormitoryID.toString()
        } : null,
        initialImages: formattedImages,
        initialRooms: formattedRooms
      }
    };
  } catch (error) {
    console.error('Error fetching dormitory:', error);
    return {
      notFound: true
    };
  }
}

const EditDorm = ({ dormitory, facility, initialImages, initialRooms }) => {
  const router = useRouter();
  const [rooms, setRooms] = useState(initialRooms.length > 0 ? initialRooms : [{ 
    id: 1, 
    name: 'Room 1',
    type: '',
    price: '',
    size: '',
    beds: '',
    photos: []
  }]);
  const [photos, setPhotos] = useState(initialImages);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState(dormitory.mapLocation || null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const roomFileInputRefs = useRef({});
  
  const [formData, setFormData] = useState({
    dormitoryName: dormitory.name_dormitory || '',
    description: dormitory.description || '',
    location: dormitory.location || '',
    type_dormitory: dormitory.type_dormitory || '',
    category_dormitory: dormitory.category_dormitory || '',
    alley: dormitory.alley || '',
    address: dormitory.address || '',
    electric_price: dormitory.electric_price || '',
    water_price: dormitory.water_price || '',
    other: dormitory.other || '',
    phone_number: dormitory.phone_number || '',
    agreement: dormitory.agreement || '',
    distance_from_university: dormitory.distance_from_university || '',
    contract_duration: dormitory.contract_duration || 3,
    gate_location: dormitory.gate_location || '',
    facilities: {
      wifi: facility?.facilities?.includes('wifi') || false,
      airConditioner: facility?.facilities?.includes('air_conditioner') || false,
      privateBathroom: facility?.facilities?.includes('private_bathroom') || false,
      refrigerator: facility?.facilities?.includes('refrigerator') || false,
      television: facility?.facilities?.includes('television') || false,
      closet: facility?.facilities?.includes('closet') || false,
      microwave: facility?.facilities?.includes('microwave') || false,
      balcony: facility?.facilities?.includes('balcony') || false,
      cctv: facility?.facilities?.includes('cctv') || false,
      desk: facility?.facilities?.includes('desk') || false,
      parking: facility?.facilities?.includes('parking') || false,
      kitchen: facility?.facilities?.includes('kitchen') || false
    }
  });
  
  const userData = {
    username: "Admin"
  };
  
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = () => {
    console.log("Logging out...");
    setShowDropdown(false);
  };
  
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        const uploadPromises = files.map(async (file) => {
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          const base64 = await base64Promise;

          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64 }),
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const result = await response.json();
          return {
            id: Date.now() + Math.random(),
            name: file.name,
            url: result.url,
            public_id: result.public_id
          };
        });

        const newPhotos = await Promise.all(uploadPromises);
        const updatedPhotos = [...photos, ...newPhotos].slice(0, 10);
        setPhotos(updatedPhotos);
      } catch (error) {
        console.error('Error uploading photos:', error);
        alert('Error uploading photos. Please try again.');
      }
    }
  };

  const handleRoomPhotoUpload = async (roomId, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        const file = files[0];
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        const newPhoto = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: result.url,
          public_id: result.public_id
        };
        
        setRooms(rooms.map(room => 
          room.id === roomId 
            ? { ...room, photos: [...room.photos, newPhoto].slice(0, 5) } 
            : room
        ));
      } catch (error) {
        console.error('Error uploading room photo:', error);
        alert('Error uploading photo. Please try again.');
      }
    }
  };

  const removePhoto = async (id) => {
    const photoToRemove = photos.find(photo => photo.id === id);
    if (photoToRemove?.public_id) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_id: photoToRemove.public_id }),
        });
      } catch (error) {
        console.error('Error deleting photo from Cloudinary:', error);
      }
    }
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const removeRoomPhoto = async (roomId, photoId) => {
    const room = rooms.find(r => r.id === roomId);
    const photoToRemove = room?.photos.find(photo => photo.id === photoId);
    if (photoToRemove?.public_id) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_id: photoToRemove.public_id }),
        });
      } catch (error) {
        console.error('Error deleting photo from Cloudinary:', error);
      }
    }
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, photos: room.photos.filter(photo => photo.id !== photoId) } 
        : room
    ));
  };

  const handleMapSelect = () => {
    setMapLocation({
      address: "Sample Location, Kahibah",
      lat: 15.123,
      lng: 102.456
    });
    setShowMapModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length < 5) {
      alert('Please upload at least 5 photos of the dormitory');
      return;
    }
    
    const roomsWithoutPhotos = rooms.filter(room => room.photos.length === 0);
    if (roomsWithoutPhotos.length > 0) {
      alert(`Please upload at least one photo for each room. ${roomsWithoutPhotos.map(r => r.name).join(', ')} missing photos.`);
      return;
    }
    
    if (!mapLocation) {
      alert('Please select a location on the map');
      return;
    }

    if (rooms.length < 2) {
      alert('Please add at least 2 rooms');
      return;
    }

    if (![3, 6, 12].includes(Number(formData.contract_duration))) {
      alert('Please select a valid contract duration (3, 6, or 12 months)');
      return;
    }

    if (!['Front Gate', 'Back Gate'].includes(formData.gate_location)) {
      alert('Please select a valid gate location (Front Gate or Back Gate)');
      return;
    }
    
    try {
      const response = await fetch(`/api/dormitory/edit/${dormitory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rooms,
          photos,
          mapLocation,
          contract_duration: Number(formData.contract_duration),
          gate_location: formData.gate_location
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dormitory');
      }

      alert('Dormitory updated successfully');
      router.push('/admin/dashboard');
    } catch (error) {
      alert(error.message);
      console.error('Error updating dormitory:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
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

          <div className={styles.formSection}>
            <h1 className={styles.contentTitle}>Edit Dormitory</h1>
            
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
                      id="privateBathroom"
                      name="privateBathroom"
                      checked={formData.facilities.privateBathroom}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="privateBathroom" className={styles.checkboxLabel}>Private Bathroom</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="refrigerator"
                      name="refrigerator"
                      checked={formData.facilities.refrigerator}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="refrigerator" className={styles.checkboxLabel}>Refrigerator</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="television"
                      name="television"
                      checked={formData.facilities.television}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="television" className={styles.checkboxLabel}>Television</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="closet"
                      name="closet"
                      checked={formData.facilities.closet}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="closet" className={styles.checkboxLabel}>Closet</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="microwave"
                      name="microwave"
                      checked={formData.facilities.microwave}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="microwave" className={styles.checkboxLabel}>Microwave</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="balcony"
                      name="balcony"
                      checked={formData.facilities.balcony}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="balcony" className={styles.checkboxLabel}>Balcony</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="cctv"
                      name="cctv"
                      checked={formData.facilities.cctv}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="cctv" className={styles.checkboxLabel}>CCTV</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="desk"
                      name="desk"
                      checked={formData.facilities.desk}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="desk" className={styles.checkboxLabel}>Desk</label>
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
                      id="kitchen"
                      name="kitchen"
                      checked={formData.facilities.kitchen}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="kitchen" className={styles.checkboxLabel}>Kitchen</label>
                  </div>
                </div>
              </div>

              {/* Dormitory Type */}
              <div className={styles.formGroup}>
                <label htmlFor="type_dormitory" className={styles.formLabel}>Dormitory Type</label>
                <select
                  id="type_dormitory"
                  name="type_dormitory"
                  className={styles.formInput}
                  value={formData.type_dormitory}
                  onChange={handleInputChange}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Mansion">Mansion</option>
                  <option value="Dormitory">Dormitory</option>
                  <option value="Condominium">Condominium</option>
                  <option value="House">House</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
              </div>

              {/* Category */}
              <div className={styles.formGroup}>
                <label htmlFor="category_dormitory" className={styles.formLabel}>Category</label>
                <select
                  id="category_dormitory"
                  name="category_dormitory"
                  className={styles.formInput}
                  value={formData.category_dormitory}
                  onChange={handleInputChange}
                >
                  <option value="Mixed">Mixed</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>

              {/* Alley */}
              <div className={styles.formGroup}>
                <label htmlFor="alley" className={styles.formLabel}>Alley</label>
                <input
                  type="text"
                  id="alley"
                  name="alley"
                  className={styles.formInput}
                  value={formData.alley}
                  onChange={handleInputChange}
                  placeholder="Enter alley"
                />
              </div>

              {/* Address */}
              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.formLabel}>Address</label>
                <textarea
                  id="address"
                  name="address"
                  className={styles.formTextarea}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>

              {/* Electric Price */}
              <div className={styles.formGroup}>
                <label htmlFor="electric_price" className={styles.formLabel}>Electric Price (per unit)</label>
                <input
                  type="number"
                  id="electric_price"
                  name="electric_price"
                  className={styles.formInput}
                  value={formData.electric_price}
                  onChange={handleInputChange}
                  placeholder="Enter electric price"
                />
              </div>

              {/* Water Price */}
              <div className={styles.formGroup}>
                <label htmlFor="water_price" className={styles.formLabel}>Water Price (per unit)</label>
                <input
                  type="number"
                  id="water_price"
                  name="water_price"
                  className={styles.formInput}
                  value={formData.water_price}
                  onChange={handleInputChange}
                  placeholder="Enter water price"
                />
              </div>

              {/* Other Fees */}
              <div className={styles.formGroup}>
                <label htmlFor="other" className={styles.formLabel}>Other Fees (per year)</label>
                <input
                  type="number"
                  id="other"
                  name="other"
                  className={styles.formInput}
                  value={formData.other}
                  onChange={handleInputChange}
                  placeholder="Enter other fees"
                />
              </div>

              {/* Phone Number */}
              <div className={styles.formGroup}>
                <label htmlFor="phone_number" className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  className={styles.formInput}
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              {/* Agreement */}
              <div className={styles.formGroup}>
                <label htmlFor="agreement" className={styles.formLabel}>Agreement Terms</label>
                <textarea
                  id="agreement"
                  name="agreement"
                  className={styles.formTextarea}
                  value={formData.agreement}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter agreement terms"
                />
              </div>

              {/* Distance from University */}
              <div className={styles.formGroup}>
                <label htmlFor="distance_from_university" className={styles.formLabel}>Distance from University (km)</label>
                <input
                  type="number"
                  id="distance_from_university"
                  name="distance_from_university"
                  className={styles.formInput}
                  value={formData.distance_from_university}
                  onChange={handleInputChange}
                  placeholder="Enter distance"
                  step="0.1"
                />
              </div>

              {/* Gate Location */}
              <div className={styles.formGroup}>
                <label htmlFor="gate_location" className={styles.formLabel}>Gate Location</label>
                <select
                  id="gate_location"
                  name="gate_location"
                  className={styles.formInput}
                  value={formData.gate_location}
                  onChange={handleInputChange}
                >
                  <option value="Front Gate">Front Gate</option>
                  <option value="Back Gate">Back Gate</option>
                </select>
              </div>

              {/* Contract Duration */}
              <div className={styles.formGroup}>
                <label htmlFor="contract_duration" className={styles.formLabel}>Contract Duration (months)</label>
                <select
                  id="contract_duration"
                  name="contract_duration"
                  className={styles.formInput}
                  value={formData.contract_duration}
                  onChange={handleInputChange}
                >
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
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
                  Update Dormitory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDorm; 