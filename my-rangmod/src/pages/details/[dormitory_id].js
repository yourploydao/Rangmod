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

  // 💡 ข้อมูลจำลอง อย่าเอาไปรวมนะ จ๊ะ
  const dummyDormitory = {
    _id: dormitory_id,
    name_dormitory: "Dummy Dormitory",
    alley: "Soi 123",
    address: "Bangkok, Thailand",
    category_dormitory: "Unisex",
    price_range: { min: 3500, max: 5500 },
    description: "A dummy dormitory for development purpose.",
    images: [
      "/images/dummy1.jpg",
      "/images/dummy2.jpg",
      "/images/dummy3.jpg",
      "/images/dummy4.jpg",
      "/images/dummy5.jpg"
    ],
    distance_from_university: 1.2,
    phone_number: "012-345-6789",
    type_dormitory: "Apartment",
    electric_price: 8,
    water_price: 20,
    other: "500"
  };

  const dummyRooms = [
    {
      _id: "room1",
      room_type: "Standard Room",
      price: 4000,
      room_size: 28,
      dormitoryID: dormitory_id,
      room_image: ["/images/room1.jpg"]
    },
    {
      _id: "room2",
      room_type: "Deluxe Room",
      price: 5000,
      room_size: 35,
      dormitoryID: dormitory_id,
      room_image: ["/images/room2.jpg"]
    }
  ];

  const dummyFacility = {
    _id: "facility1",
    dormitoryID: dormitory_id,
    facilities: ["Wifi", "Air Conditioner", "Private Bathroom", "Parking"]
  };

  return {
    props: {
      dormitory: dummyDormitory,
      rooms: dummyRooms,
      facility: dummyFacility
    }
  };
}


const DormitoryDetail = ({ dormitory, rooms, facility }) => {
  const [activePhoto, setActivePhoto] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(false);

  // Facility icons mapping
  const facilityIcons = {
    'wifi': '📶',
    'air conditioner': '❄️',
    'private bathroom': '🚿',
    'refrigerator': '❄️',
    'television': '📺',
    'closet': '👕',
    'microwave': '🍽️',
    'balcony': '🌅',
    'cctv': '📹',
    'desk': '📚',
    'parking': '🅿️'
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
                  <span>+{dormitory.images.length - 4} More Photos</span>
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
                ? `${dormitory.price_range.min.toLocaleString()} - ${dormitory.price_range.max.toLocaleString()} THB / MONTH`
                : dormitory.price_range.min
                  ? `From ${dormitory.price_range.min.toLocaleString()} THB / MONTH`
                  : dormitory.price_range.max
                    ? `Up to ${dormitory.price_range.max.toLocaleString()} THB / MONTH`
                    : 'Price not available'
            ) : 'Price not available'}
          </span>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h2>Description</h2>
          <pre>{dormitory.description || 'No description available'}</pre>
        </div>

        {/* Facilities */}
        <div className={styles.section}>
          <h2>Facilities</h2>
          <div className={styles.facilitiesList}>
            {facility?.facilities.map((facilityName, index) => (
              <div key={`facility-${index}`} className={styles.facilityItem}>
                <span className={styles.facilityIcon}>
                  {facilityIcons[facilityName.toLowerCase()] || '✨'}
                </span>
                <span>{facilityName}</span>
              </div>
            ))}
          </div>
          {facility?.facilities.length > 0 && (
            <button className={styles.showAllButton}>
              Show All {facility.facilities.length} facilities
            </button>
          )}
        </div>

        {/* Details and Map */}
        <div className={styles.detailsMapSection}>
          <div className={styles.mapContainer}>
            <a
              href="https://www.google.com/maps?q=13.65115,100.48839"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`https://maps.locationiq.com/v3/staticmap?key=pk.c829b59e04366f70c6af5a4e72e80ce3&center=13.65115,100.48839&zoom=15&size=700x150&markers=icon:large-red-cutout|13.65115,100.48839`}
                alt="Map Location"
                className={styles.map}
              />
            </a>
            <div className={styles.mapDetails}>
              <div className={styles.mapDetail}>
                <span className={styles.detailIcon}>📍</span>
                <span>0.36 kilometers away</span>
              </div>
              <div className={styles.mapDetail}>
                <span className={styles.detailIcon}>📱</span>
                <span>012-345-6789</span>
              </div>
            </div>
          </div>
          
          <div className={styles.propertyDetails}>
            <h3>{dormitory.type_dormitory}</h3>
            <div className={styles.utilityList}>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>⚡</span>
                <span className={styles.utilityName}>Electric price</span>
                <span className={styles.utilityValue}>{dormitory.electric_price} THB / UNIT</span>
              </div>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>💧</span>
                <span className={styles.utilityName}>Water price</span>
                <span className={styles.utilityValue}>{dormitory.water_price} THB / UNIT</span>
              </div>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>📑</span>
                <span className={styles.utilityName}>Other</span>
                <span className={styles.utilityValue}>{dormitory.other} THB / YEAR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Room Types */}
        <div className={styles.section}>
          <h2>Available Rooms</h2>
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
                    <span>{room.price.toLocaleString()} THB / MONTH</span>
                  </div>
                  <div className={styles.roomDetail}>
                    <span className={styles.roomIcon}>📏</span>
                    <span>{room.room_size} square meters</span>
                  </div>
                  <div className={styles.roomDetail}>
                    <span className={styles.roomIcon}>🛏️</span>
                    <span>{room.room_type}</span>
                  </div>
                  <div className={styles.roomDetail}>
                    <span className={styles.roomIcon}>📊</span>
                    <span>{room.availability_status ? 'Available' : 'Not Available'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agreement */}
        <div className={styles.section}>
          <h2>Agreement</h2>
          <pre>{dormitory.agreement || 'No agreement available'}</pre>
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