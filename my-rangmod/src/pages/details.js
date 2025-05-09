// import React, { useState, useEffect } from 'react';
// import { useRouter } from "next/router";
// import styles from "../styles/details.module.css";
// import Header from "../components/navigation";
// import Footer from "../components/footer";

// const DormitoryDetail = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [dormitory, setDormitory] = useState(null);
//   const [activePhoto, setActivePhoto] = useState(0);
//   const [galleryVisible, setGalleryVisible] = useState(false);
  
//   // Mock data - in a real app this would come from an API based on the ID
//   const mockDormitory = {
//     id: 1,
//     name: 'J Home',
//     location: 'Bangmot Thung Khru Bangkok',
//     price_range: '3,000 - 5,200 THB / MONTH',
//     description: 'New renovated rooms in the whole building (New building completely renovated)',
//     features: [
//       'Parking available',
//       'Located on Phuttha Bucha main road, near Soi Phuttha Bucha 34 (with private road access to the mansion)'
//     ],
//     facilities: [
//       { name: 'Kitchen', icon: '🍳' },
//       { name: 'Television with Netflix', icon: '📺' },
//       { name: 'Washer', icon: '🧺' },
//       { name: 'Air Conditioner', icon: '❄️' },
//       { name: 'Free Wireless Internet', icon: '📶' }
//     ],
//     details: {
//       distance: '0.5 kilometers away',
//       phone: '099-999-9999',
//       type: 'Apartment',
//       utilities: [
//         { name: 'Electric price', value: '8 THB / UNIT' },
//         { name: 'Water price', value: '17 THB / UNIT' },
//         { name: 'Other', value: '800 THB / YEAR' }
//       ]
//     },
//     room_types: [
//       {
//         name: 'Single Room',
//         price: '2,000/Month',
//         size: '22 square meter',
//         beds: '1 single bed',
//         image: '/api/placeholder/400/300'
//       },
//       {
//         name: 'Twin Room',
//         price: '3,000/Month',
//         size: '22 square meter',
//         beds: '2 single bed',
//         image: '/api/placeholder/400/300'
//       }
//     ],
//     agreement: [
//       'The minimum contract duration is one year.',
//       'Any installation that requires drilling or damaging the walls is strictly prohibited.',
//       'Free internet access is provided.',
//       'Duplicate keys can be made at the tenant\'s expense.'
//     ],
//     photos: [
//       '/api/placeholder/800/500',
//       '/api/placeholder/400/300',
//       '/api/placeholder/400/300',
//       '/api/placeholder/400/300',
//       '/api/placeholder/400/300'
//     ],
//     map_location: '/api/placeholder/400/200'
//   };

//   useEffect(() => {
//     // In a real app, this would fetch data from an API
//     // For now we use mock data
//     if (id) {
//       console.log('Fetching dormitory with ID:', id);
//       // Mock API call
//       setTimeout(() => {
//         setDormitory(mockDormitory);
//       }, 300);
//     }
//   }, [id]);

//   if (!dormitory) {
//     return (
//       <div className={styles.container}>
//         <Header />
//         <div className={styles.loading}>Loading...</div>
//         <Footer />
//       </div>
//     );
//   }

//   const handleShowAllFacilities = () => {
//     // This would navigate to a page showing all facilities or expand the list
//     console.log('Show all facilities clicked');
//   };

//   const handlePhotoClick = (index) => {
//     setActivePhoto(index);
//     setGalleryVisible(true);
//   };

//   const closeGallery = () => {
//     setGalleryVisible(false);
//   };

//   const navigatePhoto = (direction) => {
//     let newIndex = activePhoto + direction;
    
//     if (newIndex < 0) {
//       newIndex = dormitory.photos.length - 1;
//     } else if (newIndex >= dormitory.photos.length) {
//       newIndex = 0;
//     }
    
//     setActivePhoto(newIndex);
//   };

//   return (
//     <div className={styles.container}>
//       <Header />
      
//       <div className={styles.content}>
//         {/* Photo Gallery */}
//         <div className={styles.photoGrid}>
//           <div className={styles.mainPhoto}>
//             <img 
//               src={dormitory.photos[0]} 
//               alt={dormitory.name} 
//               onClick={() => handlePhotoClick(0)}
//             />
//           </div>
//           <div className={styles.smallPhotos}>
//             {dormitory.photos.slice(1, 4).map((photo, index) => (
//               <div key={`photo-${index + 1}`} className={styles.smallPhoto}>
//                 <img 
//                   src={photo} 
//                   alt={`${dormitory.name} - ${index + 1}`}
//                   onClick={() => handlePhotoClick(index + 1)}
//                 />
//               </div>
//             ))}
//             <div className={styles.smallPhoto}>
//               <img 
//                 src={dormitory.photos[4]} 
//                 alt={`${dormitory.name} - more`}
//                 onClick={() => handlePhotoClick(4)}
//               />
//               <div className={styles.morePhotos}>
//                 <span>+{dormitory.photos.length - 4} More Photos</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Basic Info */}
//         <div className={styles.basicInfo}>
//           <div className={styles.nameLocation}>
//             <h1>{dormitory.name}</h1>
//             <p>{dormitory.location}</p>
//           </div>
//           <div className={styles.gender}>
//             <span className={styles.genderIcon}>♀</span>
//             <span className={styles.genderIcon}>♂</span>
//           </div>
//         </div>

//         {/* Price Range */}
//         <div className={styles.priceRange}>
//           <span>{dormitory.price_range}</span>
//         </div>

//         {/* Description */}
//         <div className={styles.section}>
//           <h2>Description</h2>
//           <p>{dormitory.description}</p>
//           <ul className={styles.featuresList}>
//             {dormitory.features.map((feature, index) => (
//               <li key={`feature-${index}`}>
//                 {feature.includes('Parking') && <span>🅿️</span>}
//                 {feature.includes('Located') && <span>📍</span>}
//                 {feature}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Facilities */}
//         <div className={styles.section}>
//           <h2>Facilities</h2>
//           <div className={styles.facilitiesList}>
//             {dormitory.facilities.map((facility, index) => (
//               <div key={`facility-${index}`} className={styles.facilityItem}>
//                 <span className={styles.facilityIcon}>{facility.icon}</span>
//                 <span>{facility.name}</span>
//               </div>
//             ))}
//           </div>
//           <button 
//             className={styles.showAllButton}
//             onClick={handleShowAllFacilities}
//           >
//             Show All 10 facilities
//           </button>
//         </div>

//         {/* Details and Map */}
//         <div className={styles.detailsMapSection}>
//           <div className={styles.mapContainer}>
//             <img src={dormitory.map_location} alt="Map Location" className={styles.map} />
//             <div className={styles.mapDetails}>
//               <div className={styles.mapDetail}>
//                 <span className={styles.detailIcon}>📍</span>
//                 <span>{dormitory.details.distance}</span>
//               </div>
//               <div className={styles.mapDetail}>
//                 <span className={styles.detailIcon}>📱</span>
//                 <span>{dormitory.details.phone}</span>
//               </div>
//             </div>
//           </div>
          
//           <div className={styles.propertyDetails}>
//             <h3>{dormitory.details.type}</h3>
//             <div className={styles.utilityList}>
//               {dormitory.details.utilities.map((utility, index) => (
//                 <div key={`utility-${index}`} className={styles.utilityItem}>
//                   {utility.name === 'Electric price' && <span className={styles.utilityIcon}>⚡</span>}
//                   {utility.name === 'Water price' && <span className={styles.utilityIcon}>💧</span>}
//                   {utility.name === 'Other' && <span className={styles.utilityIcon}>📑</span>}
//                   <span className={styles.utilityName}>{utility.name}</span>
//                   <span className={styles.utilityValue}>{utility.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Room Types */}
//         <div className={styles.section}>
//           <h2>Room - Well Furnished Apartment</h2>
//           <div className={styles.roomTypes}>
//             {dormitory.room_types.map((room, index) => (
//               <div key={`room-${index}`} className={styles.roomCard}>
//                 <div className={styles.roomImageContainer}>
//                   <img src={room.image} alt={room.name} className={styles.roomImage} />
//                 </div>
//                 <div className={styles.roomInfo}>
//                   <h3>{room.name}</h3>
//                   <div className={styles.roomDetail}>
//                     <span className={styles.roomIcon}>💰</span>
//                     <span>{room.price}</span>
//                   </div>
//                   <div className={styles.roomDetail}>
//                     <span className={styles.roomIcon}>📏</span>
//                     <span>{room.size}</span>
//                   </div>
//                   <div className={styles.roomDetail}>
//                     <span className={styles.roomIcon}>🛏️</span>
//                     <span>{room.beds}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Agreement */}
//         <div className={styles.section}>
//           <h2>Agreement - Well Furnished Apartment</h2>
//           <ul className={styles.agreementList}>
//             {dormitory.agreement.map((clause, index) => (
//               <li key={`clause-${index}`}>• {clause}</li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Photo Gallery Modal */}
//       {galleryVisible && (
//         <div className={styles.galleryOverlay}>
//           <div className={styles.galleryContent}>
//             <button className={styles.closeGallery} onClick={closeGallery}>×</button>
//             <button className={styles.navButton} onClick={() => navigatePhoto(-1)}>❮</button>
//             <div className={styles.galleryImageContainer}>
//               <img 
//                 src={dormitory.photos[activePhoto]} 
//                 alt={`Gallery ${activePhoto + 1}`} 
//                 className={styles.galleryImage}
//               />
//               <div className={styles.photoCounter}>
//                 {activePhoto + 1} / {dormitory.photos.length}
//               </div>
//             </div>
//             <button className={styles.navButton} onClick={() => navigatePhoto(1)}>❯</button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default DormitoryDetail;



// import React, { useState, useEffect } from 'react';
// import { useRouter } from "next/router";
// import styles from "../styles/details.module.css";
// import Header from "../components/navigation";
// import Footer from "../components/footer";

// const DormitoryDetail = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [dormitory, setDormitory] = useState(null);
//   const [activePhoto, setActivePhoto] = useState(0);
//   const [galleryVisible, setGalleryVisible] = useState(false);
  
//   // Mock data - in a real app this would come from an API based on the ID
//   const mockDormitory = {
//     id: 1,
//     name: 'J Home',
//     location: 'Bangmot Thung Khru Bangkok',
//     price_range: '3,000 - 5,200 THB / MONTH',
//     description: 'New renovated rooms in the whole building (New building completely renovated)',
//     features: [
//       'Parking available',
//       'Located on Phuttha Bucha main road, near Soi Phuttha Bucha 34 (with private road access to the mansion)'
//     ],
//     facilities: [
//       { name: 'Kitchen', icon: '🍳' },
//       { name: 'Television with Netflix', icon: '📺' },
//       { name: 'Washer', icon: '🧺' },
//       { name: 'Air Conditioner', icon: '❄️' },
//       { name: 'Free Wireless Internet', icon: '📶' },
//       { name: 'Security Cameras', icon: '📹' },
//       { name: 'Elevator', icon: '🛗' },
//       { name: 'Gym', icon: '🏋️' },
//       { name: 'Swimming Pool', icon: '🏊' },
//       { name: 'Convenience Store', icon: '🏪' }
//     ],
//     details: {
//       distance: '0.5 kilometers away',
//       phone: '099-999-9999',
//       type: 'Apartment',
//       utilities: [
//         { name: 'Electric price', value: '8 THB / UNIT' },
//         { name: 'Water price', value: '17 THB / UNIT' },
//         { name: 'Other', value: '800 THB / YEAR' }
//       ]
//     },
//     room_types: [
//       {
//         name: 'Single Room',
//         price: '3,000/Month',
//         size: '22 square meter',
//         beds: '1 single bed',
//         image: '/api/placeholder/400/300'
//       },
//       {
//         name: 'Twin Room',
//         price: '4,200/Month',
//         size: '28 square meter',
//         beds: '2 single beds',
//         image: '/api/placeholder/400/300'
//       },
//       {
//         name: 'Deluxe Room',
//         price: '5,200/Month',
//         size: '32 square meter',
//         beds: '1 queen bed',
//         image: '/api/placeholder/400/300'
//       }
//     ],
//     agreement: [
//       'The minimum contract duration is one year.',
//       'Any installation that requires drilling or damaging the walls is strictly prohibited.',
//       'Free internet access is provided.',
//       'Duplicate keys can be made at the tenant\'s expense.',
//       'Pets are not allowed in the property.',
//       'Visitors must register at the front desk before entering the building.',
//       'Quiet hours from 10 PM to 6 AM must be respected.'
//     ],
//     photos: [
//       'https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg',
//       'https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg',
//       'https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg',
//       'https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg',
//       'https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg',
//       'https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg',
//       'https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg',
//       'https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg'
//     ],
//     map_location: '/api/placeholder/400/200'
//   };

//   useEffect(() => {
//     // In a real app, this would fetch data from an API
//     // For now we use mock data
//     if (id) {
//       console.log('Fetching dormitory with ID:', id);
//       // Mock API call
//       setTimeout(() => {
//         setDormitory(mockDormitory);
//       }, 300);
//     }
//   }, [id]);

//   if (!dormitory) {
//     return (
//       <div className={styles.container}>
//         <Header />
//         <div className={styles.loading}>Loading...</div>
//         <Footer />
//       </div>
//     );
//   }

//   const handleShowAllFacilities = () => {
//     // This would navigate to a page showing all facilities or expand the list
//     console.log('Show all facilities clicked');
//   };

//   const handlePhotoClick = (index) => {
//     setActivePhoto(index);
//     setGalleryVisible(true);
//   };

//   const closeGallery = () => {
//     setGalleryVisible(false);
//   };

//   const navigatePhoto = (direction) => {
//     let newIndex = activePhoto + direction;
    
//     if (newIndex < 0) {
//       newIndex = dormitory.photos.length - 1;
//     } else if (newIndex >= dormitory.photos.length) {
//       newIndex = 0;
//     }
    
//     setActivePhoto(newIndex);
//   };

//   return (
//     <div className={styles.container}>
//       <Header />
      
//       <div className={styles.content}>
//         {/* Photo Gallery */}
//         <div className={styles.photoGrid}>
//           <div className={styles.mainPhoto}>
//             <img 
//               src={dormitory.photos[0]} 
//               alt={dormitory.name} 
//               onClick={() => handlePhotoClick(0)}
//             />
//           </div>
//           <div className={styles.smallPhotos}>
//             {dormitory.photos.slice(1, 4).map((photo, index) => (
//               <div key={`photo-${index + 1}`} className={styles.smallPhoto}>
//                 <img 
//                   src={photo} 
//                   alt={`${dormitory.name} - ${index + 1}`}
//                   onClick={() => handlePhotoClick(index + 1)}
//                 />
//               </div>
//             ))}
//             <div className={styles.smallPhoto}>
//               <img 
//                 src={dormitory.photos[4]} 
//                 alt={`${dormitory.name} - more`}
//                 onClick={() => handlePhotoClick(4)}
//               />
//               <div className={styles.morePhotos}>
//                 <span>+{dormitory.photos.length - 4} More Photos</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Basic Info */}
//         <div className={styles.basicInfo}>
//           <div className={styles.nameLocation}>
//             <h1>{dormitory.name}</h1>
//             <p>{dormitory.location}</p>
//           </div>
//           <div className={styles.gender}>
//             <span className={styles.genderIcon}>♀</span>
//             <span className={styles.genderIcon}>♂</span>
//           </div>
//         </div>

//         {/* Price Range */}
//         <div className={styles.priceRange}>
//           <span>{dormitory.price_range}</span>
//         </div>

//         {/* Description */}
//         <div className={styles.section}>
//           <h2>Description</h2>
//           <p>{dormitory.description}</p>
//           <ul className={styles.featuresList}>
//             {dormitory.features.map((feature, index) => (
//               <li key={`feature-${index}`}>
//                 {feature.includes('Parking') && <span>🅿️</span>}
//                 {feature.includes('Located') && <span>📍</span>}
//                 {feature}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Facilities */}
//         <div className={styles.section}>
//           <h2>Facilities</h2>
//           <div className={styles.facilitiesList}>
//             {dormitory.facilities.slice(0, 5).map((facility, index) => (
//               <div key={`facility-${index}`} className={styles.facilityItem}>
//                 <span className={styles.facilityIcon}>{facility.icon}</span>
//                 <span>{facility.name}</span>
//               </div>
//             ))}
//           </div>
//           <button 
//             className={styles.showAllButton}
//             onClick={handleShowAllFacilities}
//           >
//             Show All {dormitory.facilities.length} facilities
//           </button>
//         </div>

//         {/* Details and Map */}
//         <div className={styles.detailsMapSection}>
//           <div className={styles.mapContainer}>
//             <img src={dormitory.map_location} alt="Map Location" className={styles.map} />
//             <div className={styles.mapDetails}>
//               <div className={styles.mapDetail}>
//                 <span className={styles.detailIcon}>📍</span>
//                 <span>{dormitory.details.distance}</span>
//               </div>
//               <div className={styles.mapDetail}>
//                 <span className={styles.detailIcon}>📱</span>
//                 <span>{dormitory.details.phone}</span>
//               </div>
//             </div>
//           </div>
          
//           <div className={styles.propertyDetails}>
//             <h3>{dormitory.details.type}</h3>
//             <div className={styles.utilityList}>
//               {dormitory.details.utilities.map((utility, index) => (
//                 <div key={`utility-${index}`} className={styles.utilityItem}>
//                   {utility.name === 'Electric price' && <span className={styles.utilityIcon}>⚡</span>}
//                   {utility.name === 'Water price' && <span className={styles.utilityIcon}>💧</span>}
//                   {utility.name === 'Other' && <span className={styles.utilityIcon}>📑</span>}
//                   <span className={styles.utilityName}>{utility.name}</span>
//                   <span className={styles.utilityValue}>{utility.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Room Types */}
//         <div className={styles.section}>
//           <h2>Room - Well Furnished Apartment</h2>
//           <div className={styles.roomTypes}>
//             {dormitory.room_types.map((room, index) => (
//               <div key={`room-${index}`} className={styles.roomCard}>
//                 <div className={styles.roomImageContainer}>
//                   <img src={room.image} alt={room.name} className={styles.roomImage} />
//                 </div>
//                 <div className={styles.roomInfo}>
//                   <h3>{room.name}</h3>
//                   <div className={styles.roomDetail}>
//                     <span className={styles.roomIcon}>💰</span>
//                     <span>{room.price}</span>
//                   </div>
//                   <div className={styles.roomDetail}>
//                     <span className={styles.roomIcon}>📏</span>
//                     <span>{room.size}</span>
//                   </div>
//                   <div className={styles.roomDetail}>
//                     <span className={styles.roomIcon}>🛏️</span>
//                     <span>{room.beds}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Agreement */}
//         <div className={styles.section}>
//           <h2>Agreement - Well Furnished Apartment</h2>
//           <ul className={styles.agreementList}>
//             {dormitory.agreement.map((clause, index) => (
//               <li key={`clause-${index}`}>• {clause}</li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Photo Gallery Modal */}
//       {galleryVisible && (
//         <div className={styles.galleryOverlay}>
//           <div className={styles.galleryContent}>
//             <button className={styles.closeGallery} onClick={closeGallery}>×</button>
//             <button className={styles.navButton} onClick={() => navigatePhoto(-1)}>❮</button>
//             <div className={styles.galleryImageContainer}>
//               <img 
//                 src={dormitory.photos[activePhoto]} 
//                 alt={`Gallery ${activePhoto + 1}`} 
//                 className={styles.galleryImage}
//               />
//               <div className={styles.photoCounter}>
//                 {activePhoto + 1} / {dormitory.photos.length}
//               </div>
//             </div>
//             <button className={styles.navButton} onClick={() => navigatePhoto(1)}>❯</button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default DormitoryDetail;

import React, { useState } from 'react';
import styles from "../styles/details.module.css";
import Header from "../components/navigation";
import Footer from "../components/footer";

const DormitoryDetail = () => {
  const [activePhoto, setActivePhoto] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(false);
  
  // แสดงผลโดยตรง ไม่ต้องรอ fetch จาก API
  const dormitory = {
    id: 1,
    name: 'J Home',
    location: 'Bangmot Thung Khru Bangkok',
    price_range: '3,000 - 5,200 THB / MONTH',
    description: 'New renovated rooms in the whole building (New building completely renovated)',
    details: {
      distance: '0.5 kilometers away',
      phone: '099-999-9999',
      type: 'Apartment'
    }
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
      newIndex = 7; // จำนวนรูปทั้งหมด - 1
    } else if (newIndex >= 8) { // จำนวนรูปทั้งหมด
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
              src="https://images.thaiapartment.com/Apartment/11506/bang-mod-place_ext01.jpg" 
              alt="J Home Main"
              onClick={() => handlePhotoClick(0)}
            />
          </div>
          <div className={styles.smallPhotos}>
            <div className={styles.smallPhoto}>
              <img 
                src="https://images.thaiapartment.com/Apartment/11506/bang-mod-place_ext01.jpg" 
                alt="J Home - 1"
                onClick={() => handlePhotoClick(1)}
              />
            </div>
            <div className={styles.smallPhoto}>
              <img 
                src="https://bcdn.renthub.in.th/listing_picture/202312/20231230/s9VV5Q62AQacdmUtRy5t.jpg?class=lthumbnail" 
                alt="J Home - 2"
                onClick={() => handlePhotoClick(2)}
              />
            </div>
            <div className={styles.smallPhoto}>
              <img 
                src="https://bcdn.renthub.in.th/listing_picture/202312/20231230/s9VV5Q62AQacdmUtRy5t.jpg?class=lthumbnailg" 
                alt="J Home - 3"
                onClick={() => handlePhotoClick(3)}
              />
            </div>
            <div className={styles.smallPhoto}>
              <img 
                src="https://images.thaiapartment.com/Apartment/11506/bang-mod-place_ext01.jpg" 
                alt="J Home - more"
                onClick={() => handlePhotoClick(4)}
              />
              <div className={styles.morePhotos}>
                <span>+4 More Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className={styles.basicInfo}>
          <div className={styles.nameLocation}>
            <h1>{dormitory.name}</h1>
            <p>{dormitory.location}</p>
          </div>
          <div className={styles.gender}>
            <span className={styles.genderIcon}>♀</span>
            <span className={styles.genderIcon}>♂</span>
          </div>
        </div>

        {/* Price Range */}
        <div className={styles.priceRange}>
          <span>{dormitory.price_range}</span>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h2>Description</h2>
          <p>{dormitory.description}</p>
          <ul className={styles.featuresList}>
            <li>
              <span>🅿️</span>
              Parking available
            </li>
            <li>
              <span>📍</span>
              Located on Phuttha Bucha main road, near Soi Phuttha Bucha 34 (with private road access to the mansion)
            </li>
          </ul>
        </div>

        {/* Facilities */}
        <div className={styles.section}>
          <h2>Facilities</h2>
          <div className={styles.facilitiesList}>
            <div className={styles.facilityItem}>
              <span className={styles.facilityIcon}>🍳</span>
              <span>Kitchen</span>
            </div>
            <div className={styles.facilityItem}>
              <span className={styles.facilityIcon}>📺</span>
              <span>Television with Netflix</span>
            </div>
            <div className={styles.facilityItem}>
              <span className={styles.facilityIcon}>🧺</span>
              <span>Washer</span>
            </div>
            <div className={styles.facilityItem}>
              <span className={styles.facilityIcon}>❄️</span>
              <span>Air Conditioner</span>
            </div>
            <div className={styles.facilityItem}>
              <span className={styles.facilityIcon}>📶</span>
              <span>Free Wireless Internet</span>
            </div>
          </div>
          <button className={styles.showAllButton}>
            Show All 10 facilities
          </button>
        </div>

        {/* Details and Map */}
        <div className={styles.detailsMapSection}>
          <div className={styles.mapContainer}>
            <img src="https://1033609670.rsc.cdn77.org/maps/ross-js-aloha-grill-las-vegas-map.jpg" alt="Map Location" className={styles.map} />
            <div className={styles.mapDetails}>
              <div className={styles.mapDetail}>
                <span className={styles.detailIcon}>📍</span>
                <span>{dormitory.details.distance}</span>
              </div>
              <div className={styles.mapDetail}>
                <span className={styles.detailIcon}>📱</span>
                <span>{dormitory.details.phone}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.propertyDetails}>
            <h3>{dormitory.details.type}</h3>
            <div className={styles.utilityList}>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>⚡</span>
                <span className={styles.utilityName}>Electric price</span>
                <span className={styles.utilityValue}>8 THB / UNIT</span>
              </div>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>💧</span>
                <span className={styles.utilityName}>Water price</span>
                <span className={styles.utilityValue}>17 THB / UNIT</span>
              </div>
              <div className={styles.utilityItem}>
                <span className={styles.utilityIcon}>📑</span>
                <span className={styles.utilityName}>Other</span>
                <span className={styles.utilityValue}>800 THB / YEAR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Room Types */}
        <div className={styles.section}>
          <h2>Room - Well Furnished Apartment</h2>
          <div className={styles.roomTypes}>
            <div className={styles.roomCard}>
              <div className={styles.roomImageContainer}>
                <img src="https://tararomestate.com/wp-content/uploads/2021/10/6F9A9384-1200x800-1.jpg" alt="Single Room" className={styles.roomImage} />
              </div>
              <div className={styles.roomInfo}>
                <h3>Single Room</h3>
                <div className={styles.roomDetail}>
                  <span className={styles.roomIcon}>💰</span>
                  <span>3,000/Month</span>
                </div>
                <div className={styles.roomDetail}>
                  <span className={styles.roomIcon}>📏</span>
                  <span>22 square meter</span>
                </div>
                <div className={styles.roomDetail}>
                  <span className={styles.roomIcon}>🛏️</span>
                  <span>1 single bed</span>
                </div>
              </div>
            </div>
            
            <div className={styles.roomCard}>
              <div className={styles.roomImageContainer}>
                <img src="https://pix10.agoda.net/hotelImages/217/2170856/2170856_17042609030052634768.jpg?ca=6&ce=1&s=1024x768" alt="Twin Room" className={styles.roomImage} />
              </div>
              <div className={styles.roomInfo}>
                <h3>Twin Room</h3>
                <div className={styles.roomDetail}>
                  <span className={styles.roomIcon}>💰</span>
                  <span>4,200/Month</span>
                </div>
                <div className={styles.roomDetail}>
                  <span className={styles.roomIcon}>📏</span>
                  <span>28 square meter</span>
                </div>
                <div className={styles.roomDetail}>
                  <span className={styles.roomIcon}>🛏️</span>
                  <span>2 single beds</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className={styles.section}>
          <h2>Agreement - Well Furnished Apartment</h2>
          <ul className={styles.agreementList}>
            <li>• The minimum contract duration is one year.</li>
            <li>• Any installation that requires drilling or damaging the walls is strictly prohibited.</li>
            <li>• Free internet access is provided.</li>
            <li>• Duplicate keys can be made at the tenant's expense.</li>
            <li>• Pets are not allowed in the property.</li>
            <li>• Visitors must register at the front desk before entering the building.</li>
            <li>• Quiet hours from 10 PM to 6 AM must be respected.</li>
          </ul>
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
                src={`/api/placeholder/${activePhoto === 0 ? '800/500' : '400/300'}`}
                alt={`Gallery ${activePhoto + 1}`} 
                className={styles.galleryImage}
              />
              <div className={styles.photoCounter}>
                {activePhoto + 1} / 8
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