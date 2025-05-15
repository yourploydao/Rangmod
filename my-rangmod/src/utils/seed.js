// import mongoose from 'mongoose';
// import Dormitory from '../models/Dormitory.js';
// import Room from '../models/Room.js';
// import Facility from '../models/Facility.js';
// import { connectDB } from '../lib/mongodb.js';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// // Load environment variables from .env file
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// dotenv.config({ path: join(__dirname, '../../.env') });

// const dormitoryImages = [
//   'https://res.cloudinary.com/disbsxrab/image/upload/v1747247612/DPP-Residence-Apartment-Bang-KhunThian-5394_Ext01_dffyo1.jpg'
// ];

// const roomImages = [
//   'https://res.cloudinary.com/disbsxrab/image/upload/v1747247438/IMG_1597-scaled-1_c79ssk.jpg'
// ];

// const dormitoryTypes = ['Apartment', 'Mansion', 'Dormitory', 'Condominium', 'House', 'Townhouse'];
// const categories = ['Mixed', 'Male', 'Female'];
// const gateLocations = ['Front Gate', 'Back Gate'];
// const contractDurations = [3, 6, 12];

// const facilities = [
//   'wifi',
//   'air_conditioner',
//   'private_bathroom',
//   'refrigerator',
//   'television',
//   'closet',
//   'microwave',
//   'balcony',
//   'cctv',
//   'desk',
//   'parking',
//   'kitchen'
// ];

// const generateDormitoryData = (index) => {
//   const type = dormitoryTypes[Math.floor(Math.random() * dormitoryTypes.length)];
//   const category = categories[Math.floor(Math.random() * categories.length)];
//   const gateLocation = gateLocations[Math.floor(Math.random() * gateLocations.length)];
//   const contractDuration = contractDurations[Math.floor(Math.random() * contractDurations.length)];
  
//   return {
//     name_dormitory: `${type} ${index + 1}`,
//     type_dormitory: type,
//     category_dormitory: category,
//     alley: `Alley ${Math.floor(Math.random() * 10) + 1}`,
//     address: `${Math.floor(Math.random() * 100) + 1} Main Street, District ${Math.floor(Math.random() * 10) + 1}`,
//     gate_location: gateLocation,
//     description: `A comfortable ${type.toLowerCase()} located in a convenient area. Perfect for students looking for a peaceful place to stay.`,
//     price_range: {
//       min: 3000 + Math.floor(Math.random() * 2000),
//       max: 6000 + Math.floor(Math.random() * 3000)
//     },
//     electric_price: 5 + Math.floor(Math.random() * 3),
//     water_price: 15 + Math.floor(Math.random() * 5),
//     other: 1000 + Math.floor(Math.random() * 2000),
//     phone_number: `08${Math.floor(Math.random() * 100000000) + 100000000}`,
//     agreement: 'Standard dormitory agreement terms and conditions apply.',
//     contract_duration: contractDuration,
//     num_of_rooms: 2 + Math.floor(Math.random() * 2), // 2 or 3 rooms
//     distance_from_university: 0.5 + Math.random() * 2,
//     last_updated: new Date(),
//     images: Array(5).fill(dormitoryImages[0]) // 5 images per dormitory
//   };
// };

// const generateRoomData = (dormitoryId, roomNumber) => {
//   return {
//     dormitoryID: dormitoryId,
//     room_type: `Room ${roomNumber}`,
//     price: 3000 + Math.floor(Math.random() * 3000),
//     availability_status: Math.random() > 0.3, // 70% chance of being available
//     room_size: 20 + Math.floor(Math.random() * 15),
//     room_image: [roomImages[0]] // 1 image per room
//   };
// };

// const generateFacilityData = (dormitoryId) => {
//   // Select 7-12 random facilities
//   const selectedFacilities = facilities
//     .sort(() => 0.5 - Math.random())
//     .slice(0, 7 + Math.floor(Math.random() * 6));

//   return {
//     facilities: selectedFacilities,
//     dormitoryID: dormitoryId
//   };
// };

// const seedDatabase = async () => {
//   try {
//     await connectDB();

//     // Clear existing data
//     await Dormitory.deleteMany({});
//     await Room.deleteMany({});
//     await Facility.deleteMany({});

//     // Generate and insert dormitories
//     const dormitories = [];
//     for (let i = 0; i < 15; i++) {
//       const dormitory = await Dormitory.create(generateDormitoryData(i));
//       dormitories.push(dormitory);

//       // Generate rooms for each dormitory
//       const numRooms = dormitory.num_of_rooms;
//       for (let j = 0; j < numRooms; j++) {
//         await Room.create(generateRoomData(dormitory._id, j + 1));
//       }

//       // Generate facilities for each dormitory
//       await Facility.create(generateFacilityData(dormitory._id));
//     }

//     console.log('Database seeded successfully!');
//     console.log(`Created ${dormitories.length} dormitories`);
    
//     // Log some statistics
//     const roomCount = await Room.countDocuments();
//     const facilityCount = await Facility.countDocuments();
//     console.log(`Created ${roomCount} rooms`);
//     console.log(`Created ${facilityCount} facility records`);

//   } catch (error) {
//     console.error('Error seeding database:', error);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// // Run the seed function
// seedDatabase(); 