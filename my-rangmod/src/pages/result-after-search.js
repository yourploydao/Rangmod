import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';
import styles from "../styles/result-after-search.module.css";
import Header from "../components/navigation";
import Footer from "../components/footer";
import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';
import Facility from '@/models/Facility';

export async function getServerSideProps() {
  try {
    await connectDB();
    
    // Fetch all dormitories
    const dormitories = await Dormitory.find({}).lean();
    
    // Fetch all facilities
    const facilities = await Facility.find({}).lean();
    
    // Create a map of dormitoryID to facilities
    const facilitiesMap = facilities.reduce((acc, facility) => {
      acc[facility.dormitoryID.toString()] = facility.facilities;
      return acc;
    }, {});
    
    // Serialize dormitory data and attach facilities
    const serializedDormitories = dormitories.map(dormitory => ({
      ...dormitory,
      _id: dormitory._id.toString(),
      last_updated: dormitory.last_updated ? new Date(dormitory.last_updated).toISOString() : null,
      facilities: facilitiesMap[dormitory._id.toString()] || []
    }));

    return {
      props: {
        initialDormitories: serializedDormitories
      }
    };
  } catch (error) {
    console.error('Error fetching dormitories:', error);
    return {
      props: {
        initialDormitories: []
      }
    };
  }
}

const DormitorySearch = ({ initialDormitories }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(router.query.search || '');
  const [activeSortOption, setActiveSortOption] = useState('ราคาต่ำที่สุด');
  const [priceRange, setPriceRange] = useState({ lowest: '', highest: '' });
  const [filteredDormitories, setFilteredDormitories] = useState(initialDormitories);
  const [allDormitories, setAllDormitories] = useState(initialDormitories);
  
  // Filters state
  const [filters, setFilters] = useState({
    dormType: {
      'อพาร์ทเมนท์': false,
      'แมนชัน': false,
      'หอพัก': false,
      'คอนโดมิเนียม': false,
      'บ้าน': false,
      'ทาวน์เฮาส์': false
    },
    category: {
      'ที่พักอาศัยหญิง': false,
      'ที่พักอาศัยชาย': false,
      'ที่พักอาศัยรวม': false
    },
    contractDuration: {
      '3 เดือน': false,
      '6 เดือน': false,
      '12 เดือน': false
    },
    gateLocation: {
      'หน้ามหาวิทยาลัย': false,
      'หลังมหาวิทยาลัย': false
    },
    facilities: {
      'ไวไฟ': false,
      'เครื่องปรับอากาศ': false,
      'ตู้เย็น': false,
      'โทรทัศน์': false,
      'ตู้เสื้อผ้า': false,
      'ไมโครเวฟ': false,
      'ระเบียง': false,
      'กล้องวงจรปิด': false,
      'โต๊ะทำงาน': false,
      'ที่จอดรถ': false,
      'ห้องครัว': false,
      'เครื่องทำน้ำอุ่น': false,
      'ร้านสะดวกซื้อ': false,
      'ร้านซักรีด': false,
      'พัดลม': false
    }
  });

  // Mapping objects for converting between Thai and English values
  const gateLocationMapping = {
    'หน้ามหาวิทยาลัย': 'Front Gate',
    'หลังมหาวิทยาลัย': 'Back Gate'
  };

  const dormTypeMapping = {
    'อพาร์ทเมนท์': 'Apartment',
    'แมนชัน': 'Mansion',
    'หอพัก': 'Dormitory',
    'คอนโดมิเนียม': 'Condominium',
    'บ้าน': 'House',
    'ทาวน์เฮาส์': 'Townhouse'
  };

  const categoryMapping = {
    'ที่พักอาศัยหญิง': 'Female',
    'ที่พักอาศัยชาย': 'Male',
    'ที่พักอาศัยรวม': 'Mixed'
  };

  // Update search query when URL changes
  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search);
    }
  }, [router.query.search]);

  // Apply all filters to the dormitories
  const applyFilters = () => {
    let results = [...allDormitories];
    
    // Filter by price range if provided
    if (priceRange.lowest || priceRange.highest) {
      const lowest = priceRange.lowest ? parseInt(priceRange.lowest.replace(/[^0-9]/g, '')) : 0;
      const highest = priceRange.highest ? parseInt(priceRange.highest.replace(/[^0-9]/g, '')) : Infinity;
      
      if (!isNaN(lowest) || !isNaN(highest)) {
        results = results.filter(dorm => {
          const min = dorm.price_range?.min || 0;
          const max = dorm.price_range?.max || 0;
          return (min <= highest && max >= lowest);
        });
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(dorm => 
        dorm.name_dormitory.toLowerCase().includes(query) || 
        dorm.type_dormitory.toLowerCase().includes(query) ||
        (dorm.address && dorm.address.toLowerCase().includes(query)) ||
        (dorm.alley && dorm.alley.toLowerCase().includes(query))
      );
    }
    
    // Filter by contract duration
    const selectedDurations = Object.entries(filters.contractDuration)
      .filter(([, selected]) => selected)
      .map(([duration]) => {
        // Extract number from duration string (e.g., "3 เดือน" -> 3)
        const match = duration.match(/(\d+)/);
        return match ? parseInt(match[1]) : null;
      })
      .filter(duration => duration !== null);
    
    if (selectedDurations.length > 0) {
      results = results.filter(dorm => 
        selectedDurations.includes(dorm.contract_duration)
      );
    }

    // Filter by gate location
    const selectedGates = Object.entries(filters.gateLocation)
      .filter(([, selected]) => selected)
      .map(([gate]) => gateLocationMapping[gate]);
    
    if (selectedGates.length > 0) {
      results = results.filter(dorm => 
        selectedGates.includes(dorm.gate_location)
      );
    }
    
    // Filter by dormitory type
    const selectedDormTypes = Object.entries(filters.dormType)
      .filter(([, selected]) => selected)
      .map(([type]) => dormTypeMapping[type]);
    
    if (selectedDormTypes.length > 0) {
      results = results.filter(dorm => 
        selectedDormTypes.includes(dorm.type_dormitory)
      );
    }

    // Filter by category (Male/Female/Mixed)
    const selectedCategories = Object.entries(filters.category)
      .filter(([, selected]) => selected)
      .map(([category]) => categoryMapping[category]);
    
    if (selectedCategories.length > 0) {
      results = results.filter(dorm => 
        selectedCategories.includes(dorm.category_dormitory)
      );
    }
    
    // Filter by facilities
    const selectedFacilities = Object.entries(filters.facilities)
      .filter(([, selected]) => selected)
      .map(([facility]) => facility);
    
    if (selectedFacilities.length > 0) {
      const facilityMapping = {
        'ไวไฟ': 'wifi',
        'เครื่องปรับอากาศ': 'air_conditioner',
        'ตู้เย็น': 'refrigerator',
        'โทรทัศน์': 'television',
        'ตู้เสื้อผ้า': 'closet',
        'ไมโครเวฟ': 'microwave',
        'ระเบียง': 'balcony',
        'กล้องวงจรปิด': 'cctv',
        'โต๊ะทำงาน': 'desk',
        'ที่จอดรถ': 'parking',
        'ห้องครัว': 'kitchen',
        'เครื่องทำน้ำอุ่น': 'water_heater',
        'ร้านสะดวกซื้อ': 'convenience_store',
        'ร้านซักรีด': 'laundry',
        'พัดลม': 'fan'
      };

      results = results.filter(dorm => {
        if (!Array.isArray(dorm.facilities)) return false;
        
        return selectedFacilities.every(facility => {
          const dbFacilityName = facilityMapping[facility] || facility.toLowerCase();
          return dorm.facilities.includes(dbFacilityName);
        });
      });
    }
    
    // Apply sorting
    return sortDormitories(results, activeSortOption);
  };

  // Function to sort dormitories based on option
  const sortDormitories = (dorms, sortOption) => {
    const sortedDorms = [...dorms];
    
    switch (sortOption) {
      case 'ราคาต่ำที่สุด':
        return sortedDorms.sort((a, b) => {
          const aPrice = a.price_range?.min || 0;
          const bPrice = b.price_range?.min || 0;
          return aPrice - bPrice;
        });
      
      case 'ราคาสูงที่สุด':
        return sortedDorms.sort((a, b) => {
          const aPrice = a.price_range?.max || 0;
          const bPrice = b.price_range?.max || 0;
          return bPrice - aPrice;
        });
      
      case 'ใกล้มหาวิทยาลัยที่สุด':
        return sortedDorms.sort((a, b) => {
          const aDistance = a.distance_from_university || Infinity;
          const bDistance = b.distance_from_university || Infinity;
          return aDistance - bDistance;
        });
      
      default:
        return sortedDorms;
    }
  };

  const fetchFilteredDormitories = () => {
    const filtered = applyFilters();
    setFilteredDormitories(filtered);
  };

  useEffect(() => {
    fetchFilteredDormitories();
  }, [searchQuery, priceRange, filters, activeSortOption]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredDormitories();
  };

  const handleSearchClick = () => {
    fetchFilteredDormitories();
  };

  const handleSortChange = (sortOption) => {
    setActiveSortOption(sortOption);
  };

  const handleFilterChange = (category, item) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item]
      }
    }));
  };

  return (
    <div className={styles.container}>
      <Header />

      {/* Search Box */}
      <div className={styles.searchBoxWrapper}>
        <div className={styles.searchBox}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchField}>
              <div className={styles.inputWithIcon}>
                <span className={styles.searchIcon}>
                  <image src="https://cdn-icons-png.flaticon.com/128/1458/1458268.png" alt="Search" className={styles.iconImage} />
                </span>
                <input 
                  type="text" 
                  placeholder="ค้นหาหอพักที่คุณสนใจ..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.SearchButtons}>
              <button onClick={handleSearchClick} className={styles.searchButton}>ค้นหา</button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>

          {/* Rental Price Range */}
          <div className={styles.filterSection}>
            <h3>ราคาค่าเช่าที่พักอาศัย</h3>
            <div className={styles.priceInputs}>
              <input 
                type="text" 
                placeholder="ราคาต่ำที่สุด" 
                value={priceRange.lowest}
                onChange={(e) => setPriceRange({...priceRange, lowest: e.target.value})}
                className={styles.priceInput}
              />
              <input 
                type="text" 
                placeholder="ราคาสูงที่สุด" 
                value={priceRange.highest}
                onChange={(e) => setPriceRange({...priceRange, highest: e.target.value})}
                className={styles.priceInput}
              />
            </div>
          </div>

          {/* Contract Duration Filter */}
          <div className={styles.filterSection}>
            <h3>ระยะเวลาขั้นต่ำของสัญญา</h3>
            <div className={styles.filterList}>
              {Object.entries(filters.contractDuration).map(([duration, checked]) => (
                <div key={duration} className={styles.filterItem}>
                  <input 
                    type="checkbox" 
                    id={`duration-${duration}`}
                    checked={checked}
                    onChange={() => handleFilterChange('contractDuration', duration)}
                    className={styles.checkboxHidden}
                  />
                  <label htmlFor={`duration-${duration}`} className={styles.checkboxLabel}>
                    {checked && <span className={styles.checkIcon} style={{ color: 'white' }}>✓</span>}
                  </label>
                  <span>{duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gate Location Filter */}
          <div className={styles.filterSection}>
            <h3>ตำแหน่งประตูทางเข้า</h3>
            <div className={styles.filterList}>
              {Object.entries(filters.gateLocation).map(([gate, checked]) => (
                <div key={gate} className={styles.filterItem}>
                  <input 
                    type="checkbox" 
                    id={`gate-${gate}`}
                    checked={checked}
                    onChange={() => handleFilterChange('gateLocation', gate)}
                    className={styles.checkboxHidden}
                  />
                  <label htmlFor={`gate-${gate}`} className={styles.checkboxLabel}>
                    {checked && <span className={styles.checkIcon} style={{ color: 'white' }}>✓</span>}
                  </label>
                  <span>{gate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className={styles.filterSection}>
            <h3>หมวดหมู่ที่พักอาศัย</h3>
            <div className={styles.filterList}>
              {Object.entries(filters.category).map(([category, checked]) => (
                <div key={category} className={styles.filterItem}>
                  <input 
                    type="checkbox" 
                    id={`category-${category}`}
                    checked={checked}
                    onChange={() => handleFilterChange('category', category)}
                    className={styles.checkboxHidden}
                  />
                  <label htmlFor={`category-${category}`} className={styles.checkboxLabel}>
                    {checked && <span className={styles.checkIcon} style={{ color: 'white' }}>✓</span>}
                  </label>
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dormitory Type */}
          <div className={styles.filterSection}>
            <h3>ประเภทที่พักอาศัย</h3>
            <div className={styles.filterList}>
              {Object.entries(filters.dormType).map(([type, checked]) => (
                <div key={type} className={styles.filterItem}>
                  <input 
                    type="checkbox" 
                    id={`dorm-${type}`}
                    checked={checked}
                    onChange={() => handleFilterChange('dormType', type)}
                    className={styles.checkboxHidden}
                  />
                  <label htmlFor={`dorm-${type}`} className={styles.checkboxLabel}>
                    {checked && <span className={styles.checkIcon} style={{ color: 'white' }}>✓</span>}
                  </label>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className={styles.filterSection}>
            <h3>สิ่งอำนวยความสะดวก</h3>
            <div className={styles.filterList}>
              {Object.entries(filters.facilities).map(([facility, checked]) => (
                <div key={facility} className={styles.filterItem}>
                  <input 
                    type="checkbox" 
                    id={`facility-${facility}`}
                    checked={checked}
                    onChange={() => handleFilterChange('facilities', facility)}
                    className={styles.checkboxHidden}
                  />
                  <label htmlFor={`facility-${facility}`} className={styles.checkboxLabel}>
                    {checked && <span className={styles.checkIcon} style={{ color: 'white' }}>✓</span>}
                  </label>
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.results}>
          {/* Sort Options */}
          <div className={styles.sortOptions}>
            <span className={styles.sortText}>เรียงลำดับตาม</span>
            <div className={styles.sortSlot}>
              <button 
                className={`${styles.sortButton} ${activeSortOption === 'ราคาต่ำที่สุด' ? styles.active : ''}`}
                onClick={() => handleSortChange('ราคาต่ำที่สุด')}
              >
                ราคาต่ำที่สุด
              </button>
              <button 
                className={`${styles.sortButton} ${activeSortOption === 'ราคาสูงที่สุด' ? styles.active : ''}`}
                onClick={() => handleSortChange('ราคาสูงที่สุด')}
              >
                ราคาสูงที่สุด
              </button>
              <button 
                className={`${styles.sortButton} ${activeSortOption === 'ใกล้มหาวิทยาลัยที่สุด' ? styles.active : ''}`}
                onClick={() => handleSortChange('ใกล้มหาวิทยาลัยที่สุด')}
              >
                ใกล้มหาวิทยาลัยที่สุด
              </button>
            </div>
          </div>

          {/* Dormitory Cards */}
          <div className={styles.dormCardsList}>
            {filteredDormitories.map(dorm => (
              <Link href={`/details/${dorm._id}`} key={dorm._id} className={styles.dormCardLink}>
                <div className={styles.dormCardHorizontal}>
                  <div className={styles.dormImageContainerHorizontal}>
                    <image 
                      src={dorm.images[0] || '/images/placeholder.jpg'} 
                      alt={dorm.name_dormitory} 
                      className={styles.dormImageHorizontal} 
                    />
                  </div>
                  <div className={styles.dormInfoHorizontal}>
                    <h3 className={styles.dormNameHorizontal}>{dorm.name_dormitory}</h3>
                    <div className={styles.dormPriceHorizontal}>
                      {dorm.price_range?.min?.toLocaleString()} - {dorm.price_range?.max?.toLocaleString()} บาท/เดือน
                    </div>
                    <div className={styles.dormTypeHorizontal}>{dorm.type_dormitory}</div>
                    <div className={styles.dormRefreshedHorizontal}>
                      {dorm.distance_from_university?.toFixed(2)} กิโลเมตร จากมหาวิทยาลัย
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DormitorySearch;