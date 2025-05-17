import React, { useState } from 'react';
import styles from "../../styles/details.module.css";
import Header from "../../components/navigation";
import Footer from "../../components/footer";
import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';
import Room from '@/models/Room';
import Facility from '@/models/Facility';
import mongoose from 'mongoose';

export async function getServerSideProps(context) {
  const { dormitory_id } = context.params;
  console.log('Fetching dormitory with ID:', dormitory_id);

  try {
    await connectDB();
    
    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(dormitory_id)) {
      console.error('Invalid dormitory ID format:', dormitory_id);
      return { notFound: true };
    }

    // Convert string ID to ObjectId
    const dormitoryObjectId = new mongoose.Types.ObjectId(dormitory_id);
    
    // Fetch dormitory with error logging
    const dormitory = await Dormitory.findById(dormitoryObjectId).lean();
    console.log('Found dormitory:', dormitory ? 'Yes' : 'No');
    
    if (!dormitory) {
      console.error('Dormitory not found with ID:', dormitory_id);
      return { notFound: true };
    }

    // Fetch related data
    const rooms = await Room.find({ dormitoryID: dormitoryObjectId }).lean();
    console.log('Found rooms:', rooms.length);
    
    const facility = await Facility.findOne({ dormitoryID: dormitoryObjectId }).lean();
    console.log('Found facility:', facility ? 'Yes' : 'No');

    // Fix object serialization issue
    const serializedDormitory = {
      ...dormitory,
      _id: dormitory._id.toString(),
      last_updated: dormitory.last_updated ? new Date(dormitory.last_updated).toISOString() : null,
      distance_from_university: dormitory.distance_from_university || null,
      location: dormitory.location || null,
    };

    const serializedRooms = rooms.map(room => ({
      ...room,
      _id: room._id.toString(),
      dormitoryID: room.dormitoryID.toString()
    }));

    const serializedFacility = facility ? {
      ...facility,
      _id: facility._id.toString(),
      dormitoryID: facility.dormitoryID.toString()
    } : null;

    return {
      props: { 
        dormitory: serializedDormitory,
        rooms: serializedRooms,
        facility: serializedFacility,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
}

const DormitoryDetail = ({ dormitory, rooms, facility }) => {
  const [activePhoto, setActivePhoto] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(false);

  // Facility icons mapping
const facilityIcons = {
  'wifi': '📶',
  'air_conditioner': '❄️',
  'private bathroom': '🚿',
  'refrigerator': '❄️',
  'television': '📺',
  'closet': '👕',
  'microwave': '🍽️',
  'balcony': '🌅',
  'cctv': '📹',
  'desk': '📚',
  'parking': '🅿️',
  'laundry': '🩲',
  'waterHeater':'🛁',
  'fan':'🍃',
  'convenience_store':'🏪',
};

const facilityTranslations = {
  'wifi': 'WiFi',
  'air_conditioner': 'เครื่องปรับอากาศ',
  'private bathroom': 'ห้องน้ำส่วนตัว',
  'refrigerator': 'ตู้เย็น',
  'television': 'โทรทัศน์',
  'closet': 'ตู้เสื้อผ้า',
  'microwave': 'ไมโครเวฟ',
  'balcony': 'ระเบียง',
  'cctv': 'กล้องวงจรปิด',
  'desk': 'โต๊ะทำงาน',
  'parking': 'ที่จอดรถ',
  'laundry': 'ร้านซักรีด',
  'waterHeater':'เครื่องทำน้ำอุ่น',
  'fan':'พัดลม',
  'convenience_store':'ร้านสะดวกซื้อ',
};

const dormitoryTypeTranslations = {
  'apartment': 'อพาร์ตเมนต์',
  'mansion': 'แมนชัน',
  'dormitory': 'หอพัก',
  'condominium': 'คอนโดมิเนียม',
  'house': 'บ้าน',
  'townhouse': 'ทาวน์เฮาส์'
};


  const handlePhotoClick = (index) => {
    setActivePhoto(index);
    setGalleryVisible(true);
  };

  const closeGallery = () => {
    setGalleryVisible(false);
  };

  const navigatePhoto = (direction) => {
    let newIndex = activePhoto + direction;
    
    if (newIndex < 0) {
      newIndex = dormitory.images.length - 1;
    } else if (newIndex >= dormitory.images.length) {
      newIndex = 0;
    }
    
    setActivePhoto(newIndex);
  };

  

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        {/* Photo Gallery */}
        <div className={styles.photoGrid}>
          <div className={styles.mainPhoto}>
            <img 
              src={dormitory.images[0]} 
              alt={dormitory.name_dormitory}
              onClick={() => handlePhotoClick(0)}
            />
          </div>
          <div className={styles.smallPhotos}>
            {dormitory.images.slice(1, 4).map((photo, index) => (
              <div key={`photo-${index + 1}`} className={styles.smallPhoto}>
                <img 
                  src={photo} 
                  alt={`${dormitory.name_dormitory} - ${index + 1}`}
                  onClick={() => handlePhotoClick(index + 1)}
                />
              </div>
            ))}
            {dormitory.images.length > 4 && (
              <div className={styles.smallPhoto}>
                <img 
                  src={dormitory.images[4]} 
                  alt={`${dormitory.name_dormitory} - more`}
                  onClick={() => handlePhotoClick(4)}
                />
                <div className={styles.morePhotos}>
                  <span>+{dormitory.images.length - 4} ภาพเพิ่มเติม</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className={styles.basicInfo}>
          <div className={styles.nameLocation}>
            <h1>{dormitory.name_dormitory}</h1>
            <p>{`${dormitory.alley}, ${dormitory.address}`}</p>
          </div>
          <div className={styles.gender}>
            <span className={styles.genderIcon}>
              {dormitory.category_dormitory === 'Female' ? '♀' : dormitory.category_dormitory === 'Male' ? '♂' : '♀♂'}
            </span>
          </div>
        </div>

        {/* Price Range */}
        <div className={styles.priceRange}>
          <span>
            {dormitory.price_range ? (
              dormitory.price_range.min && dormitory.price_range.max
                ? `${dormitory.price_range.min.toLocaleString()} - ${dormitory.price_range.max.toLocaleString()} บาท/เดือน`
                : dormitory.price_range.min
                  ? `ขั้นต่ำ ${dormitory.price_range.min.toLocaleString()} บาท/เดือน`
                  : dormitory.price_range.max
                    ? `สูงสุด ${dormitory.price_range.max.toLocaleString()} บาท/เดือน`
                    : 'ราคายังไม่พร้อมใช้งาน'
            ) : 'ราคายังไม่พร้อมใช้งาน'}
          </span>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h2>คำอธิบายหอพัก</h2>
          <pre>{dormitory.description || 'คำอธิบายไม่พร้อมใช้งาน'}</pre>
        </div>

        {/* Facilities */}
        <div className={styles.section}>
          <h2>สิ่งอำนวยความสะดวก</h2>
          <div className={styles.facilitiesList}>
            {facility?.facilities.map((facilityName, index) => {
              const key = facilityName.toLowerCase();
              return (
                <div key={`facility-${index}`} className={styles.facilityItem}>
                  <span className={styles.facilityIcon}>
                    {facilityIcons[key] || '✨'}
                  </span>
                  <span>{facilityTranslations[key] || facilityName}</span>
                </div>
              );
            })}
          </div>
        </div>


        {/* Details and Map */}
        <div className={styles.detailsMapSection}>
          <div className={styles.mapContainer}>
        {(() => {
          const location = dormitory.location || '';
          const [lat, lng] = location.split(',').map(coord => coord.trim());
        
          // ตรวจสอบว่ามีพิกัดถูกต้อง
          if (!lat || !lng) {
            return <p>ตำแหน่งยังไม่สามารถใช้งานได้</p>;
          }
        
          const googleMapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
          const staticMapUrl = `https://maps.locationiq.com/v3/staticmap?key=pk.c829b59e04366f70c6af5a4e72e80ce3&center=${lat},${lng}&zoom=15&size=700x150&markers=icon:large-red-cutout|${lat},${lng}`;
        
          return (
            <a href={googleMapUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={staticMapUrl}
                alt="Map Location"
                className={styles.map}
              />
            </a>
          );
        })()}

            <div className={styles.mapDetails}>
              <div className={styles.mapDetail}>
                <span className={styles.detailIcon}>📍</span>
                <span>
                  {dormitory.distance_from_university
                    ? `ห่างจากมหาวิทยาลัย ${dormitory.distance_from_university.toFixed(2)} กิโลเมตร`
                    : 'ระยะห่างระหว่างมหาวิทยาลัยยังไม่สามารถใช้งานได้'}
                </span>
              </div>
               <div className={styles.mapDetail}>
                <span className={styles.detailIcon}>📱</span>
                <span>{dormitory.phone_number}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.propertyDetails}>
            <h3>{dormitoryTypeTranslations[dormitory.type_dormitory.toLowerCase()] || dormitory.type_dormitory}</h3>
            <div className={styles.utilityList}>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>⚡</span>
                <span className={styles.utilityName}>ค่าไฟฟ้า</span>
                <span className={styles.utilityValue}>{dormitory.electric_price} บาท/หน่วย</span>
              </div>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>💧</span>
                <span className={styles.utilityName}>ค่าน้ำ</span>
                <span className={styles.utilityValue}>{dormitory.water_price} บาท/หน่วย</span>
              </div>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>📑</span>
                <span className={styles.utilityName}>อื่นๆ</span>
                <span className={styles.utilityValue}>{dormitory.other} บาท/ปี</span>
              </div>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>📑</span>
                <span className={styles.utilityName}>ระยะเวลาขั้นต่ำของสัญญา</span>
                <span className={styles.utilityValue}>{dormitory.contract_duration} เดือน</span>
              </div>
            </div>
          </div>
        </div>

        {/* Room Types */}
        <div className={styles.section}>
          <h2>ประเภทห้องพัก</h2>
          <div className={styles.roomTypes}>
            {rooms.map((room) => (
              <div key={room._id} className={styles.roomCard}>
                <div className={styles.roomImageContainer}>
                  <img 
                    src={room.room_image[0] || '/images/placeholder.jpg'} 
                    alt={room.room_type} 
                    className={styles.roomImage} 
                  />
                </div>
                <div className={styles.roomInfo}>
                  <h3>{room.room_type}</h3>
                  <div className={styles.roomDetail}>
                    <span className={styles.roomIcon}>💰</span>
                    <span>{room.price.toLocaleString()} บาท/เดือน</span>
                  </div>
                  <div className={styles.roomDetail}>
                    <span className={styles.roomIcon}>📏</span>
                    <span>{room.room_size} ตารางเมตร</span>
                  </div>
                  <div className={styles.roomDetail}>
                    <span className={styles.roomIcon}>🛏️</span>
                    <span>{room.room_type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agreement */}
        <div className={styles.section}>
          <h2>ข้อตกลง</h2>
          <pre>{dormitory.agreement || 'ไม่มีข้อตกลง'}</pre>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {galleryVisible && (
        <div className={styles.galleryOverlay}>
          <div className={styles.galleryContent}>
            <button className={styles.closeGallery} onClick={closeGallery}>×</button>
            <button className={styles.navButton} onClick={() => navigatePhoto(-1)}>❮</button>
            <div className={styles.galleryImageContainer}>
              <img 
                src={dormitory.images[activePhoto]}
                alt={`Gallery ${activePhoto + 1}`} 
                className={styles.galleryImage}
              />
              <div className={styles.photoCounter}>
                {activePhoto + 1} / {dormitory.images.length}
              </div>
            </div>
            <button className={styles.navButton} onClick={() => navigatePhoto(1)}>❯</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DormitoryDetail;