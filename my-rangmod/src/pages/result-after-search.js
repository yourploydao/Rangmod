import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import styles from "../styles/result-after-search.module.css";
import Header from "../components/navigation";
import Footer from "../components/footer";

const DormitorySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSortOption, setActiveSortOption] = useState('lowest price');
  const [priceRange, setPriceRange] = useState({ lowest: '', highest: '' });
  const [filteredDormitories, setFilteredDormitories] = useState([]);
  
  // Mock data that would be from DB in real implementation
  const [allDormitories, setAllDormitories] = useState([
    {
      id: 1,
      name: 'Cosmos Home',
      priceRange: '3,000 - 4,500',
      type: 'University-Affiliated Dormitory',
      refreshedAt: '21/02/2025',
      image: '/images/cosmos-home.jpg'
    },
    {
      id: 2,
      name: 'Tanasit Resident',
      priceRange: '3,000 - 4,500',
      type: 'Mixed-gender Dormitory',
      refreshedAt: '10/02/2025',
      image: '/images/tanasit-resident.jpg'
    },
    {
      id: 3,
      name: 'My Place',
      priceRange: '4,200 - 7,500',
      type: 'Female Dormitory',
      refreshedAt: '21/02/2025',
      image: '/images/my-place.jpg'
    },
    {
      id: 4,
      name: 'Bann Suanthon',
      priceRange: '5,000 - 8,000',
      type: 'University-Affiliated Dormitory',
      refreshedAt: '10/02/2025',
      image: '/images/bann-suanthon.jpg'
    },
    {
        id: 5,
        name: 'J Home',
        priceRange: '2,800 - 4,000',
        type: 'Mixed-gender Dormitory',
        refreshedAt: '15/02/2025',
        image: '/images/bann-suanthon.jpg'
      }
  ]);

  // Local filters (mock part)
  const [filters, setFilters] = useState({
    dormType: {
      'Female Dorm': true,
      'Mixed Dorm': false,
      'condo': true,
    },
    facilities: {
      'fan': true,
      'Air Conditioner': false,
      'kitchen': true,
    }
  });

  // Apply all filters to the dormitories
  const applyFilters = () => {
    let results = [...allDormitories];
    
    // Filter by price range if provided
    if (priceRange.lowest && priceRange.highest) {
      const lowest = parseInt(priceRange.lowest.replace(/,/g, ''));
      const highest = parseInt(priceRange.highest.replace(/,/g, ''));
      
      if (!isNaN(lowest) && !isNaN(highest)) {
        results = results.filter(dorm => {
          const [min, max] = dorm.priceRange.split(' - ').map(price => 
            parseInt(price.replace(/,/g, ''))
          );
          
          // Check if there's any overlap in price ranges
          return (min <= highest && max >= lowest);
        });
      }
    } else if (priceRange.lowest) {
      const lowest = parseInt(priceRange.lowest.replace(/,/g, ''));
      
      if (!isNaN(lowest)) {
        results = results.filter(dorm => {
          const [, max] = dorm.priceRange.split(' - ').map(price => 
            parseInt(price.replace(/,/g, ''))
          );
          return max >= lowest;
        });
      }
    } else if (priceRange.highest) {
      const highest = parseInt(priceRange.highest.replace(/,/g, ''));
      
      if (!isNaN(highest)) {
        results = results.filter(dorm => {
          const [min] = dorm.priceRange.split(' - ').map(price => 
            parseInt(price.replace(/,/g, ''))
          );
          return min <= highest;
        });
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(dorm => 
        dorm.name.toLowerCase().includes(query) || 
        dorm.type.toLowerCase().includes(query)
      );
    }
    
    // Filter by dormitory type
    const selectedDormTypes = Object.entries(filters.dormType)
      .filter(([, selected]) => selected)
      .map(([type]) => type.toLowerCase());
    
    if (selectedDormTypes.length > 0) {
      results = results.filter(dorm => {
        const dormType = dorm.type.toLowerCase();
        return selectedDormTypes.some(type => dormType.includes(type));
      });
    }
    
    // Apply sorting based on active sort option
    sortDormitories(results, activeSortOption);
    
    return results;
  };

  // Function to sort dormitories based on option
  const sortDormitories = (dorms, sortOption) => {
    if (sortOption === 'lowest price') {
      return dorms.sort((a, b) => {
        const aPrice = parseInt(a.priceRange.split(' - ')[0].replace(/,/g, ''));
        const bPrice = parseInt(b.priceRange.split(' - ')[0].replace(/,/g, ''));
        return aPrice - bPrice;
      });
    } else if (sortOption === 'highest price') {
      return dorms.sort((a, b) => {
        const aPrice = parseInt(a.priceRange.split(' - ')[1].replace(/,/g, ''));
        const bPrice = parseInt(b.priceRange.split(' - ')[1].replace(/,/g, ''));
        return bPrice - aPrice;
      });
    } else if (sortOption === 'closest to KMUTT') {
      // Mock implementation - in real app would use geolocation
      console.log('Sorting by distance to KMUTT');
      return dorms;
    }
    return dorms;
  };

  // Mock function to simulate DB fetch/filter
  const fetchFilteredDormitories = () => {
    // In real implementation, this would make an API call with the filters
    console.log('Fetching dormitories with filters:', filters);
    console.log('Price range:', priceRange);
    
    const filtered = applyFilters();
    setFilteredDormitories(filtered);
  };

  useEffect(() => {
    // Initial data load
    setFilteredDormitories([...allDormitories]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredDormitories();
  };

  const handleSearchClick = () => {
    fetchFilteredDormitories();
  };

  const handleSortChange = (sortOption) => {
    setActiveSortOption(sortOption);
    
    // Apply new sorting to current filtered results
    const sorted = [...filteredDormitories];
    sortDormitories(sorted, sortOption);
    setFilteredDormitories(sorted);
  };

  const handleFilterChange = (category, item) => {
    const updatedFilters = {
      ...filters,
      [category]: {
        ...filters[category],
        [item]: !filters[category][item]
      }
    };
    
    setFilters(updatedFilters);
  };

  return (
    <div className={styles.container}>
      {/* Header Component */}
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
              {/* <div className={styles.mapPin}>📍</div> */}
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

          {/* Your Filters */}
          <div className={styles.filterSection}>
            <h3>Your filters</h3>
            <div className={styles.filterList}>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="filter-condo" 
                  checked={filters.dormType.condo}
                  onChange={() => handleFilterChange('dormType', 'condo')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="filter-condo" className={styles.checkboxLabel}>
                  <span className={styles.checkIcon}>✓</span>
                </label>
                <span>condo</span>
              </div>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="filter-fan" 
                  checked={filters.facilities.fan}
                  onChange={() => handleFilterChange('facilities', 'fan')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="filter-fan" className={styles.checkboxLabel}>
                  <span className={styles.checkIcon}>✓</span>
                </label>
                <span>fan</span>
              </div>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="filter-kitchen" 
                  checked={filters.facilities.kitchen}
                  onChange={() => handleFilterChange('facilities', 'kitchen')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="filter-kitchen" className={styles.checkboxLabel}>
                  <span className={styles.checkIcon}>✓</span>
                </label>
                <span>kitchen</span>
              </div>
            </div>
          </div>

          {/* Dormitory Type */}
          <div className={styles.filterSection}>
            <h3>Dormitory</h3>
            <div className={styles.filterList}>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="dorm-female" 
                  checked={filters.dormType['Female Dorm']}
                  onChange={() => handleFilterChange('dormType', 'Female Dorm')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="dorm-female" className={styles.checkboxLabel}>
                  {filters.dormType['Female Dorm'] && <span className={styles.checkIcon}>✓</span>}
                </label>
                <span>Female Dorm</span>
              </div>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="dorm-mixed" 
                  checked={filters.dormType['Mixed Dorm']}
                  onChange={() => handleFilterChange('dormType', 'Mixed Dorm')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="dorm-mixed" className={styles.checkboxLabel}>
                  {filters.dormType['Mixed Dorm'] && <span className={styles.checkIcon}>✓</span>}
                </label>
                <span>Mixed Dorm</span>
              </div>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="dorm-condo" 
                  checked={filters.dormType.condo}
                  onChange={() => handleFilterChange('dormType', 'condo')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="dorm-condo" className={styles.checkboxLabel}>
                  <span className={styles.checkIcon}>✓</span>
                </label>
                <span>condo</span>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className={styles.filterSection}>
            <h3>Facilities</h3>
            <div className={styles.filterList}>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="facility-fan" 
                  checked={filters.facilities.fan}
                  onChange={() => handleFilterChange('facilities', 'fan')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="facility-fan" className={styles.checkboxLabel}>
                  <span className={styles.checkIcon}>✓</span>
                </label>
                <span>fan</span>
              </div>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="facility-ac" 
                  checked={filters.facilities['Air Conditioner']}
                  onChange={() => handleFilterChange('facilities', 'Air Conditioner')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="facility-ac" className={styles.checkboxLabel}>
                  {filters.facilities['Air Conditioner'] && <span className={styles.checkIcon}>✓</span>}
                </label>
                <span>Air Conditioner</span>
              </div>
              <div className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  id="facility-kitchen" 
                  checked={filters.facilities.kitchen}
                  onChange={() => handleFilterChange('facilities', 'kitchen')}
                  className={styles.checkboxHidden}
                />
                <label htmlFor="facility-kitchen" className={styles.checkboxLabel}>
                  <span className={styles.checkIcon}>✓</span>
                </label>
                <span>kitchen</span>
              </div>
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
                Closest to KMUTT.
              </button>
              <button 
                className={`${styles.sortButton} ${activeSortOption === 'highest price' ? styles.active : ''}`}
                onClick={() => handleSortChange('highest price')}
              >
                Highest price
              </button>
            </div>
          </div>

          {/* Dormitory Cards - Horizontal style matching Image 2 */}
          <div className={styles.dormCardsList}>
            {filteredDormitories.map(dorm => (
              <div key={dorm.id} className={styles.dormCardHorizontal}>
                <div className={styles.dormImageContainerHorizontal}>
                  <img src={`/api/placeholder/200/150`} alt={dorm.name} className={styles.dormImageHorizontal} />
                </div>
                <div className={styles.dormInfoHorizontal}>
                  <h3 className={styles.dormNameHorizontal}>{dorm.name}</h3>
                  <div className={styles.dormPriceHorizontal}>{dorm.priceRange} THB/Month</div>
                  <div className={styles.dormTypeHorizontal}>{dorm.type}</div>
                  <div className={styles.dormRefreshedHorizontal}>refreshed at : {dorm.refreshedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default DormitorySearch;