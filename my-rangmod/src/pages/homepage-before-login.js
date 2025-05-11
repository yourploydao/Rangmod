// RangMod Dormitory Search Component
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/homepage-before-login.module.css";
import Header from "../components/navigation";
import Footer from "../components/footer";
import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';

export async function getServerSideProps() {
  try {
    await connectDB();
    
    // Fetch all dormitories
    const dormitories = await Dormitory.find({}).lean();
    
    // Serialize the data
    const serializedDormitories = dormitories.map(dormitory => ({
      ...dormitory,
      _id: dormitory._id.toString(),
      last_updated: dormitory.last_updated || null
    }));

    return {
      props: {
        dormitories: serializedDormitories
      }
    };
  } catch (error) {
    console.error('Error fetching dormitories:', error);
    return {
      props: {
        dormitories: []
      }
    };
  }
}

const RangModDormitory = ({ dormitories }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1 Year");
  const [selectedGate, setSelectedGate] = useState("Front Gate");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", {
      query: searchQuery,
      filter: selectedFilter || "Not selected",
    });
    // Router navigation would go here
  };

  const handleSearchClick = () => {
    router.push('/search-results');
  };

  const handleDormitoryClick = (dormitoryId) => {
    router.push(`/details/${dormitoryId}`);
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleContractClick = (duration) => {
    setSelectedDuration(duration);
  };

  const handleGateSelection = (gate) => {
    setSelectedGate(gate);
  };

  // Filter dormitories based on contract duration
  const getDormitoriesByDuration = (duration) => {
    return dormitories.filter(dormitory => {
      const agreement = dormitory.agreement?.toLowerCase() || '';
      if (duration === "3 Months") {
        return agreement.includes('3 month') || agreement.includes('3-month');
      } else if (duration === "6 Months") {
        return agreement.includes('6 month') || agreement.includes('6-month');
      } else if (duration === "1 Year") {
        return agreement.includes('1 year') || agreement.includes('12 month') || agreement.includes('12-month');
      }
      return true;
    });
  };

  // Filter dormitories based on university affiliation
  const getDormitoriesByGate = (gate) => {
    return dormitories.filter(dormitory => {
      const type = dormitory.type_dormitory?.toLowerCase() || '';
      return type.includes('university') || type.includes('affiliated');
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Let's Find Your Perfect Dorm<br />Near University</h1>
            <h2 className={styles.heroSubtitle}>— Fast, Easy, and All in One Place.</h2>
            <p className={styles.heroText}>
              Helping you find the right place, right near campus.<br />
              Because your next chapter deserves the perfect start.
            </p>
          </div>
          <div className={styles.heroImage}>
            <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/534785066.jpg?k=1927ac9bd502bc207108657e4e11b87b30820061666a0ab83e75a7d48d9e4163&o=&hp=1" alt="Cozy Dorm Room" />
          </div>
        </section>

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

         {/* Updated Recommendations Section */}
      <section className={styles.recommendationsSection}>
        <h2 className={styles.sectionTitle}>Recommand</h2>

        <div className={styles.dormCards}>
          <div className={styles.dormCard}>
            <div className={styles.cardImage}>
              <img src="https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Bann Suanthon" />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.dormTitle}>Bann Suanthon</h3>
              <p className={styles.priceRange}>5,000 - 8,000 THB/Month</p>
              <p className={styles.dormType}>University-Affiliated Dormitory</p>
              <p className={styles.refreshDate}>refreshed at : 10/02/2025</p>
            </div>
          </div>

          <div className={styles.dormCard}>
            <div className={styles.cardImage}>
              <img src="https://s.isanook.com/wo/0/ud/42/210425/210425-thumbnail.jpg?ip/crop/w670h402/q80/jpg" alt="Cosmos Home" />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.dormTitle}>Cosmos Home</h3>
              <p className={styles.priceRange}>3,000 - 4,500 THB/Month</p>
              <p className={styles.dormType}>University-Affiliated Dormitory</p>
              <p className={styles.refreshDate}>refreshed at : 21/02/2025</p>
            </div>
          </div>

          <div className={styles.dormCard}>
            <div className={styles.cardImage}>
              <img src="https://bcdn.renthub.in.th/listing_picture/202410/20241009/XqYWvXx45LET7ZeKMpUd.jpg?class=lthumbnail" alt="My Place1" />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.dormTitle}>My Place1</h3>
              <p className={styles.priceRange}>4,200 - 7,500 THB/Month</p>
              <p className={styles.dormType}>Female Dormitory</p>
              <p className={styles.refreshDate}>refreshed at : 21/02/2025</p>
            </div>
          </div>

          <div className={styles.dormCard}>
            <div className={styles.cardImage}>
              <img src="https://bcdn.renthub.in.th/listing_picture/202312/20231230/s9VV5Q62AQacdmUtRy5t.jpg?class=lthumbnail" alt="Tanasit Resident" />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.dormTitle}>Tanasit Resident</h3>
              <p className={styles.priceRange}>3,000 - 4,500 THB/Month</p>
              <p className={styles.dormType}>Mixed-gender Dormitory</p>
              <p className={styles.refreshDate}>refreshed at : 10/02/2025</p>
            </div>
          </div>
        </div>
      </section>

        {/* Contract Duration Section */}
        <section className={styles.contractSection}>
          <h3 className={styles.contractTitle}>Minimum Contract Duration</h3>
          <div className={styles.contractButtons}>
            <button 
              className={`${styles.contractButton} ${selectedDuration === "3 Months" ? styles.active : ""}`}
              onClick={() => handleContractClick("3 Months")}
            >
              3 Months
            </button>
            <button 
              className={`${styles.contractButton} ${selectedDuration === "6 Months" ? styles.active : ""}`}
              onClick={() => handleContractClick("6 Months")}
            >
              6 Months
            </button>
            <button 
              className={`${styles.contractButton} ${selectedDuration === "1 Year" ? styles.active : ""}`}
              onClick={() => handleContractClick("1 Year")}
            >
              1 Year
            </button>
          </div>
        </section>

        {/* More Dormitories Section */}
        <section className={styles.moreDormsSection}>
          <div className={styles.dormCards}>
            {getDormitoriesByDuration(selectedDuration).map((dormitory) => (
              <div 
                key={dormitory._id} 
                className={styles.dormCard} 
                onClick={() => handleDormitoryClick(dormitory._id)}
              >
                <div className={styles.cardImage}>
                  <img 
                    src={dormitory.images[0] || '/images/placeholder.jpg'} 
                    alt={dormitory.name_dormitory} 
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.dormTitle}>{dormitory.name_dormitory}</h3>
                  <p className={styles.priceRange}>
                    {dormitory.price_range?.min?.toLocaleString()} - {dormitory.price_range?.max?.toLocaleString()} THB/Month
                  </p>
                  <p className={styles.dormFeature}>{dormitory.type_dormitory}</p>
                  <p className={styles.refreshDate}>
                    refreshed at: {new Date(dormitory.last_updated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* University-Affiliated Section */}
        <section className={styles.universitySection}>
          <h2 className={styles.sectionTitle}>University-Affiliated Dormitory</h2>
          
          <div className={styles.gateButtons}>
            <button 
              className={`${styles.gateButton} ${selectedGate === "Front Gate" ? styles.activeGate : ""}`}
              onClick={() => handleGateSelection("Front Gate")}
            >
              Front Gate
            </button>
            <button 
              className={`${styles.gateButton} ${selectedGate === "Back Gate" ? styles.activeGate : ""}`}
              onClick={() => handleGateSelection("Back Gate")}
            >
              Back Gate
            </button>
          </div>

          <div className={styles.dormCards}>
            {getDormitoriesByGate(selectedGate).map((dormitory) => (
              <div 
                key={dormitory._id} 
                className={styles.dormCard} 
                onClick={() => handleDormitoryClick(dormitory._id)}
              >
                <div className={styles.cardImage}>
                  <img 
                    src={dormitory.images[0] || '/images/placeholder.jpg'} 
                    alt={dormitory.name_dormitory} 
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.dormTitle}>{dormitory.name_dormitory}</h3>
                  <p className={styles.priceRange}>
                    {dormitory.price_range?.min?.toLocaleString()} - {dormitory.price_range?.max?.toLocaleString()} THB/Month
                  </p>
                  <p className={styles.dormFeature}>{dormitory.type_dormitory}</p>
                  <p className={styles.refreshDate}>
                    refreshed at: {new Date(dormitory.last_updated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RangModDormitory;