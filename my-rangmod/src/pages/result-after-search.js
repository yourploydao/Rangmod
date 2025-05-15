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
  const [activeSortOption, setActiveSortOption] = useState('lowest price');
  const [priceRange, setPriceRange] = useState({ lowest: '', highest: '' });
  const [filteredDormitories, setFilteredDormitories] = useState(initialDormitories);
  const [allDormitories, setAllDormitories] = useState(initialDormitories);
  
  // Filters state
  const [filters, setFilters] = useState({
    dormType: {
      'Apartment': false,
      'Mansion': false,
      'Dormitory': false,
      'Condominium': false,
      'House': false,
      'Townhouse': false
    },
    category: {
      'Female': false,
      'Mixed': false,
      'Male': false
    },
    contractDuration: {
      '3': false,
      '6': false,
      '12': false
    },
    gateLocation: {
      'Front Gate': false,
      'Back Gate': false
    },
    facilities: {
      'wifi': false,
      'airConditioner': false,
      'privateBathroom': false,
      'refrigerator': false,
      'television': false,
      'closet': false,
      'microwave': false,
      'balcony': false,
      'cctv': false,
      'desk': false,
      'parking': false,
      'kitchen': false
    }
  });

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
    if (priceRange.lowest && priceRange.highest) {
      const lowest = parseInt(priceRange.lowest.replace(/,/g, ''));
      const highest = parseInt(priceRange.highest.replace(/,/g, ''));
      
      if (!isNaN(lowest) && !isNaN(highest)) {
        results = results.filter(dorm => {
          const min = dorm.price_range?.min || 0;
          const max = dorm.price_range?.max || 0;
          return (min <= highest && max >= lowest);
        });
      }
    } else if (priceRange.lowest) {
      const lowest = parseInt(priceRange.lowest.replace(/,/g, ''));
      if (!isNaN(lowest)) {
        results = results.filter(dorm => (dorm.price_range?.max || 0) >= lowest);
      }
    } else if (priceRange.highest) {
      const highest = parseInt(priceRange.highest.replace(/,/g, ''));
      if (!isNaN(highest)) {
        results = results.filter(dorm => (dorm.price_range?.min || 0) <= highest);
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(dorm => 
        dorm.name_dormitory.toLowerCase().includes(query) || 
        dorm.type_dormitory.toLowerCase().includes(query) ||
        dorm.address.toLowerCase().includes(query)
      );
    }
    
    // Filter by contract duration
    const selectedDurations = Object.entries(filters.contractDuration)
      .filter(([, selected]) => selected)
      .map(([duration]) => parseInt(duration));
    
    if (selectedDurations.length > 0) {
      results = results.filter(dorm => 
        selectedDurations.includes(dorm.contract_duration)
      );
    }

    // Filter by gate location
    const selectedGates = Object.entries(filters.gateLocation)
      .filter(([, selected]) => selected)
      .map(([gate]) => gate);
    
    if (selectedGates.length > 0) {
      results = results.filter(dorm => 
        selectedGates.includes(dorm.gate_location)
      );
    }
    
    // Filter by dormitory type
    const selectedDormTypes = Object.entries(filters.dormType)
      .filter(([, selected]) => selected)
      .map(([type]) => type.toLowerCase());
    
    if (selectedDormTypes.length > 0) {
      results = results.filter(dorm => {
        const dormType = dorm.type_dormitory.toLowerCase();
        return selectedDormTypes.some(type => dormType.includes(type));
      });
    }

    // Filter by category (Male/Female/Mixed)
    const selectedCategories = Object.entries(filters.category)
      .filter(([, selected]) => selected)
      .map(([category]) => category);
    
    if (selectedCategories.length > 0) {
      results = results.filter(dorm => {
        // Exact match for category
        return selectedCategories.includes(dorm.category_dormitory);
      });
    }
    
    // Filter by facilities
    const selectedFacilities = Object.entries(filters.facilities)
      .filter(([, selected]) => selected)
      .map(([facility]) => facility);
    
    if (selectedFacilities.length > 0) {
      results = results.filter(dorm => {
        // Check if dorm has facilities array
        if (!Array.isArray(dorm.facilities)) return false;
        
        // Check if all selected facilities are present in the dorm's facilities array
        return selectedFacilities.every(facility => {
          // Convert facility name to match the database field name
          const dbFacilityName = facility === 'airConditioner' ? 'air_conditioner' : 
                               facility === 'privateBathroom' ? 'private_bathroom' :
                               facility.toLowerCase();
          
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
      case 'lowest price':
        return sortedDorms.sort((a, b) => {
          const aPrice = a.price_range?.min || 0;
          const bPrice = b.price_range?.min || 0;
          return aPrice - bPrice;
        });
      
      case 'highest price':
        return sortedDorms.sort((a, b) => {
          const aPrice = a.price_range?.max || 0;
          const bPrice = b.price_range?.max || 0;
          return bPrice - aPrice;
        });
      
      case 'closest to KMUTT':
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
                <span className={styles.searchIcon}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search Your Interest Dormitory..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.filterButtons}>
              <button type="button" className={styles.filterBtn}>
                <span className={styles.filterIcon}>🔍</span>
                Filter
              </button>
              <button onClick={handleSearchClick} className={styles.searchButton}>Search</button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          {/* Map Search */}
          <div className={styles.mapSearch}>
            <div className={styles.mapContainer}>
              <img src="https://1033609670.rsc.cdn77.org/maps/sky-dairy-and-takeaway-tokoroa-map.jpg" alt="Map" className={styles.map} />
            </div>
            <div className={styles.mapSearchText}>Search on the map</div>
          </div>

          {/* Rental Price Range */}
          <div className={styles.filterSection}>
            <h3>Rental price</h3>
            <div className={styles.priceInputs}>
              <input 
                type="text" 
                placeholder="lowest" 
                value={priceRange.lowest}
                onChange={(e) => setPriceRange({...priceRange, lowest: e.target.value})}
                className={styles.priceInput}
              />
              <input 
                type="text" 
                placeholder="highest" 
                value={priceRange.highest}
                onChange={(e) => setPriceRange({...priceRange, highest: e.target.value})}
                className={styles.priceInput}
              />
            </div>
          </div>

          {/* Contract Duration Filter */}
          <div className={styles.filterSection}>
            <h3>Contract Duration</h3>
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
                    {checked && <span className={styles.checkIcon} style={{ color: 'black' }}>✓</span>}
                  </label>
                  <span>{duration} Months</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gate Location Filter */}
          <div className={styles.filterSection}>
            <h3>Gate Location</h3>
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
                    {checked && <span className={styles.checkIcon} style={{ color: 'black' }}>✓</span>}
                  </label>
                  <span>{gate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className={styles.filterSection}>
            <h3>Category</h3>
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
                    {checked && <span className={styles.checkIcon} style={{ color: 'black' }}>✓</span>}
                  </label>
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dormitory Type */}
          <div className={styles.filterSection}>
            <h3>Dormitory Type</h3>
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
                    {checked && <span className={styles.checkIcon} style={{ color: 'black' }}>✓</span>}
                  </label>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className={styles.filterSection}>
            <h3>Facilities</h3>
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
                    {checked && <span className={styles.checkIcon} style={{ color: 'black' }}>✓</span>}
                  </label>
                  <span>{facility === 'airConditioner' ? 'Air Conditioner' : 
                         facility === 'privateBathroom' ? 'Private Bathroom' :
                         facility.charAt(0).toUpperCase() + facility.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.results}>
          {/* Sort Options */}
          <div className={styles.sortOptions}>
            <span className={styles.sortText}>Sort by</span>
            <div className={styles.sortSlot}>
              <button 
                className={`${styles.sortButton} ${activeSortOption === 'lowest price' ? styles.active : ''}`}
                onClick={() => handleSortChange('lowest price')}
              >
                Lowest price
              </button>
              <button 
                className={`${styles.sortButton} ${activeSortOption === 'closest to KMUTT' ? styles.active : ''}`}
                onClick={() => handleSortChange('closest to KMUTT')}
              >
                Closest to KMUTT
              </button>
              <button 
                className={`${styles.sortButton} ${activeSortOption === 'highest price' ? styles.active : ''}`}
                onClick={() => handleSortChange('highest price')}
              >
                Highest price
              </button>
            </div>
          </div>

          {/* Dormitory Cards */}
          <div className={styles.dormCardsList}>
            {filteredDormitories.map(dorm => (
              <Link href={`/details/${dorm._id}`} key={dorm._id} className={styles.dormCardLink}>
                <div className={styles.dormCardHorizontal}>
                  <div className={styles.dormImageContainerHorizontal}>
                    <img 
                      src={dorm.images[0] || '/images/placeholder.jpg'} 
                      alt={dorm.name_dormitory} 
                      className={styles.dormImageHorizontal} 
                    />
                  </div>
                  <div className={styles.dormInfoHorizontal}>
                    <h3 className={styles.dormNameHorizontal}>{dorm.name_dormitory}</h3>
                    <div className={styles.dormPriceHorizontal}>
                      {dorm.price_range?.min?.toLocaleString()} - {dorm.price_range?.max?.toLocaleString()} THB/Month
                    </div>
                    <div className={styles.dormTypeHorizontal}>{dorm.type_dormitory}</div>
                    <div className={styles.dormRefreshedHorizontal}>
                      {dorm.distance_from_university?.toFixed(2)} km from KMUTT
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