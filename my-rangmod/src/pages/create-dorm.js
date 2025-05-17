import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Trash2, MapPin } from 'lucide-react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from "../styles/create-dorm.module.css";
import SidebarAdmin from '@/components/sidebar-setting-admin';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

const MapSelector = dynamic(() => import('../components/MapSelector'), {
  ssr: false, // ปิดการโหลดในฝั่ง Server
});

const CreateDormitoryPage = () => {
  const router = useRouter();
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
  const [distanceKm, setDistanceKm] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    role: 'User',
    profile_picture: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    dormitoryName: '',
    description: '',
    location: '',
    type_dormitory: 'Apartment',
    category_dormitory: 'Mixed',
    alley: '',
    address: '',
    electric_price: '',
    water_price: '',
    other: 0,
    phone_number: '',
    agreement: '',
    distance_from_university: '',
    contract_duration: 3,
    gate_location: 'Front Gate',
    facilities: {
      wifi: false,
      air_conditioner: false,
      refrigerator: false,
      television: false,
      closet: false,
      microwave: false,
      balcony: false,
      cctv: false,
      desk: false,
      parking: false,
      kitchen: false,
      water_heater: false,
      convenience_store: false,
      laundry: false,
      fan: false
    }
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const user = response.data;
          setUserData({
            name: user.name || user.username,
            username: user.username,
            phone: user.phone || 'Not set',
            email: user.email,
            role: user.role || 'User',
            profile_picture: user.profile_picture || 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
          });
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          router.push('/signin');
          return;
        }
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
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
      // Clear any local storage or state
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      router.push("/signin");
    } catch (err) {
      console.error('Logout error:', err);
      alert('ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง');
    }
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        const uploadPromises = files.map(async (file) => {
          // Convert file to base64
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          const base64 = await base64Promise;

          // Upload to Cloudinary
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64 }),
          });

          if (!response.ok) {
            throw new Error('การอัปโหลดรูปภาพล้มเหลว');
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
        
        // Limit to 10 photos total
        const updatedPhotos = [...photos, ...newPhotos].slice(0, 10);
        setPhotos(updatedPhotos);
      } catch (error) {
        console.error('Error uploading photos:', error);
        alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  const handleRoomPhotoUpload = async (roomId, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        const file = files[0];
        // Convert file to base64
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        // Upload to Cloudinary
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) {
          throw new Error('อัปโหลดรูปภาพไม่สำเร็จ');
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
        console.error('อัปโหลดรูปภาพห้องไม่สำเร็จ:', error);
        alert('อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
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
        console.error('ไม่สามารถลบรูปภาพจาก Cloudinary ได้:', error);
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
        console.error('ไม่สามารถลบรูปภาพจาก Cloudinary ได้', error);
      }
    }
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, photos: room.photos.filter(photo => photo.id !== photoId) } 
        : room
    ));
  };

  const handleMapSelect = (lat, lng) => {
    const referenceLat = 13.65147;
    const referenceLng = 100.49620;

    const distance = calculateDistance(lat, lng, referenceLat, referenceLng);

    setMapLocation({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    setDistanceKm(distance.toFixed(2));  // เก็บระยะทาง
    setShowMapModal(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length < 5) {
      alert('กรุณาอัปโหลดรูปภาพของหอพักอย่างน้อย 5 รูป');
      return;
    }
    
    // Validate all rooms have at least one photo
    const roomsWithoutPhotos = rooms.filter(room => room.photos.length === 0);
    if (roomsWithoutPhotos.length > 0) {
      alert(`กรุณาอัปโหลดรูปภาพอย่างน้อยหนึ่งรูปสำหรับแต่ละห้อง โดยห้องที่ยังไม่มีรูปภาพได้แก่: ${roomsWithoutPhotos.map(r => r.name).join(', ')}`);
      return;
    }
    
    if (!mapLocation) {
      alert('กรุณาเลือกตำแหน่งบนแผนที่');
      return;
    }

    if (rooms.length < 1) {
      alert('กรุณาเพิ่มห้องอย่างน้อย 1 ห้อง');
      return;
    }

    // Validate contract duration
    if (![3, 6, 12].includes(Number(formData.contract_duration))) {
      alert('กรุณาเลือกระยะเวลาสัญญาที่ถูกต้อง (3, 6 หรือ 12 เดือน)');
      return;
    }

    // Validate gate location
    if (!['Front Gate', 'Back Gate'].includes(formData.gate_location)) {
      alert('กรุณาเลือกตำแหน่งประตูทางเข้าที่ถูกต้อง (ประตูหน้าหรือประตูหลังมหาวิทยาลัย)');
      return;
    }
    
    try {
      const combinedLocation = mapLocation?.lat && mapLocation?.lng 
       ? `${mapLocation.lat},${mapLocation.lng}`
       : formData.location;
      
      formData.location = combinedLocation;
      const distance = distanceKm != null ? distanceKm.toString() : '';

      const response = await fetch('/api/dormitory/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rooms,
          photos,
          location: combinedLocation,
          distance_from_university: distance,
          contract_duration: Number(formData.contract_duration),
          gate_location: formData.gate_location
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'การสร้างหอพักล้มเหลว');
      }

      // Redirect to the dormitory details page
      window.location.href = `/details/${data.dormitoryId}`;
    } catch (error) {
      alert(error.message);
      console.error('ไม่สามารถสร้างหอพักได้:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>กรุณารอสักครู่...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <SidebarAdmin />

        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.greeting}>
              <h1>สวัสดี, {userData.username}</h1>
              <p>ขอให้มีวันที่ดีนะ!</p>
            </div>
            
            <div className={styles.headerRightSection}>
              <div className={styles.userInfo}>
                <div className={styles.userProfile} ref={dropdownRef} onClick={handleProfileClick}>
                  <img 
                    src={userData.profile_picture} 
                    alt="รูปโปรไฟล์" 
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
                        <span>ออกจากระบบ</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h1 className={styles.contentTitle}>หน้าควบคุมแอดมิน</h1>
            
            <div className={styles.formContainer}>
              <h2 className={styles.sectionTitle}>ส่วนรายละเอียดหอพัก</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="dormitoryName" className={styles.formLabel}>ชื่อหอพัก</label>
                <input
                  type="text"
                  id="dormitoryName"
                  name="dormitoryName"
                  className={styles.formInput}
                  value={formData.dormitoryName}
                  onChange={handleInputChange}
                  placeholder="ชื่อหอพัก"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>รูปภาพหอพักของคุณ (จำเป็นต้องมีรูปภาพ 5–10 รูป)</label>
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
                      <span className={styles.uploadText}>อัปโหลดรูปภาพ</span>
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
                อัปโหลดรูปภาพแล้ว {photos.length}/10 รูป ({photos.length < 5 ? `${5 - photos.length} ยังไม่ครบตามที่กำหนด` : 'ครบตามเงื่อนไขขั้นต่ำ'})
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>คำอธิบายหอพัก</label>
                <textarea
                  id="description"
                  name="description"
                  className={styles.formTextarea}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="คำอธิบายหอพัก"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>สิ่งอำนวยความสะดวก</label>
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
                    <label htmlFor="wifi" className={styles.checkboxLabel}>Wifi</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="air_conditioner"
                      name="air_conditioner"
                      checked={formData.facilities.air_conditioner}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="air_conditioner" className={styles.checkboxLabel}>เครื่องปรับอากาศ</label>
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
                    <label htmlFor="refrigerator" className={styles.checkboxLabel}>ตู้เย็น</label>
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
                    <label htmlFor="television" className={styles.checkboxLabel}>โทรทัศน์</label>
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
                    <label htmlFor="closet" className={styles.checkboxLabel}>ตู้เสื้อผ้า</label>
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
                    <label htmlFor="microwave" className={styles.checkboxLabel}>ไมโครเวฟ</label>
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
                    <label htmlFor="balcony" className={styles.checkboxLabel}>ระเบียง</label>
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
                    <label htmlFor="cctv" className={styles.checkboxLabel}>กล้องวงจรปิด</label>
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
                    <label htmlFor="desk" className={styles.checkboxLabel}>โต๊ะทำงาน</label>
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
                    <label htmlFor="parking" className={styles.checkboxLabel}>ที่จอดรถ</label>
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
                    <label htmlFor="kitchen" className={styles.checkboxLabel}>ห้องครัว</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="water_heater"
                      name="water_heater"
                      checked={formData.facilities.water_heater}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="water_heater" className={styles.checkboxLabel}>เครื่องทำน้ำอุ่น</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="convenience_store"
                      name="convenience_store"
                      checked={formData.facilities.convenience_store}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="convenience_store" className={styles.checkboxLabel}>ร้านสะดวกซื้อ</label>
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
                    <label htmlFor="laundry" className={styles.checkboxLabel}>ร้านซักรีด</label>
                  </div>
                  <div className={styles.facilityItem}>
                    <input
                      type="checkbox"
                      id="fan"
                      name="fan"
                      checked={formData.facilities.fan}
                      onChange={handleCheckboxChange}
                      className={styles.checkbox}
                    />
                    <label htmlFor="fan" className={styles.checkboxLabel}>พัดลม</label>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="type_dormitory" className={styles.formLabel}>ประเภทที่พักอาศัย</label>
                <select
                  id="type_dormitory"
                  name="type_dormitory"
                  className={styles.formInput}
                  value={formData.type_dormitory}
                  onChange={handleInputChange}
                >
                  <option value="Apartment">อพาร์ทเมนท์</option>
                  <option value="Mansion">แมนชัน</option>
                  <option value="Dormitory">หอพัก</option>
                  <option value="Condominium">คอนโดมิเนียม</option>
                  <option value="House">บ้าน</option>
                  <option value="Townhouse">ทาวน์เฮาส์</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category_dormitory" className={styles.formLabel}>หมวดหมู่ที่พักอาศัย</label>
                <select
                  id="category_dormitory"
                  name="category_dormitory"
                  className={styles.formInput}
                  value={formData.category_dormitory}
                  onChange={handleInputChange}
                >
                  <option value="Mixed">ที่พักอาศัยรวม</option>
                  <option value="Male">ที่พักอาศัยชาย</option>
                  <option value="Female">ที่พักอาศัยหญิง</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="alley" className={styles.formLabel}>ซอย</label>
                <input
                  type="text"
                  id="alley"
                  name="alley"
                  className={styles.formInput}
                  value={formData.alley}
                  onChange={handleInputChange}
                  placeholder="กรุณากรอกซอย"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.formLabel}>ที่อยู่</label>
                <textarea
                  id="address"
                  name="address"
                  className={styles.formTextarea}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="กรุณาใส่ที่อยู่ให้ครบถ้วน"
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="electric_price" className={styles.formLabel}>ค่าไฟ (per unit)</label>
                <input
                  type="number"
                  id="electric_price"
                  name="electric_price"
                  className={styles.formInput}
                  value={formData.electric_price}
                  onChange={handleInputChange}
                  placeholder="ค่าไฟ (บาท/หน่วย)"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="water_price" className={styles.formLabel}>ค่าน้ำ (per unit)</label>
                <input
                  type="number"
                  id="water_price"
                  name="water_price"
                  className={styles.formInput}
                  value={formData.water_price}
                  onChange={handleInputChange}
                  placeholder="ค่าน้ำ (บาท/หน่วย)"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="other" className={styles.formLabel}>ค่าบริการอื่น ๆ (per year)</label>
                <input
                  type="number"
                  id="other"
                  name="other"
                  className={styles.formInput}
                  value={formData.other}
                  onChange={handleInputChange}
                  placeholder="ค่าบริการอื่น ๆ (บาท/ปี)"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone_number" className={styles.formLabel}>เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  className={styles.formInput}
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="กรุณาใส่เบอร์โทรศัพท์"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="agreement" className={styles.formLabel}>ข้อกำหนดและเงื่อนไข</label>
                <textarea
                  id="agreement"
                  name="agreement"
                  className={styles.formTextarea}
                  value={formData.agreement}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="กรุณาใส่ข้อกำหนดและเงื่อนไข"
                />
              </div>

              {/* Location Map */}
               <div className={styles.formGroup}>
                 <label className={styles.formLabel}>Location</label>
                 <div className={styles.mapContainer}>
                 {mapLocation ? (
                   <>
                     <div className={styles.mapPreview}>
                 <img
                   src={`https://maps.locationiq.com/v3/staticmap?key=pk.c829b59e04366f70c6af5a4e72e80ce3&center=${mapLocation.lat},${mapLocation.lng}&zoom=15&size=700x150&markers=icon:large-red-cutout|${mapLocation.lat},${mapLocation.lng}`}
                   alt="Map location"
                   className={styles.mapImage}
                   onClick={() => setShowMapModal(true)}  // เพิ่มตรงนี้!
                   style={{ cursor: 'pointer' }}          // ทำให้ดูเป็นปุ่มคลิก
                 />
                   </div>
                   {distanceKm && (
                     <div className={styles.mapAddress}>
                       <MapPin size={24} className={styles.mapPinSmall} />
                     <span>{mapLocation.address}</span>
                       <span style={{ marginLeft: '24px', color: '#555', marginBottom: '5px' }}>
                         ระยะห่างจากจุดอ้างอิง: {distanceKm} กม.
                       </span>
                     </div>
                   )}
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
                         onClick={() => setShowMapModal(false)}  // ปิด modal
                       >
                         <X size={20} />
                       </button>
                     </div>
                     <div className={styles.modalBody}>
                       <div className={styles.modalMapContainer}>
                         {/* ใช้ MapSelector */}
                         <MapSelector onSelect={handleMapSelect} />
                       </div>
                       <div className={styles.modalActions}>
                         <button 
                           className={styles.cancelBtn}
                           onClick={() => setShowMapModal(false)}  // ปิด modal
                         >
                           Cancel
                         </button>
                         <button 
                           className={styles.saveLocationBtn}
                           onClick={() => setShowMapModal(false)}  // ปิด modal โดยไม่ทำอะไร
                         >
                           Save Location
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               )}
              <div className={styles.sectionDivider}>
                <h3 className={styles.sectionTitle}>ข้อมูลห้องพัก</h3>
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
                      นำห้องออก
                    </button>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>รูปห้องของคุณ</label>
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
                          <span className={styles.uploadText}>เปลี่ยนรูปภาพ</span>
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
                        <label className={styles.formLabel}>ประเภทห้องพัก</label>
                        <input 
                          type="text" 
                          className={styles.formInput} 
                          placeholder="ห้องเดี่ยว" 
                          value={room.type}
                          onChange={(e) => handleRoomInputChange(room.id, 'type', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formColumn}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>ราคาห้องพัก (ต่อเดือน)</label>
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
                        <label className={styles.formLabel}>ขนาดห้องพัก (ตารางเมตร)</label>
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
                        <label className={styles.formLabel}>จำนวนเตียง</label>
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
                  + สร้างห้องพักเพิ่ม
                </button>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.createButton}
                  onClick={handleSubmit}
                >
                  สร้างที่พัก
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