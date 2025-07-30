import React, { useState } from 'react';
import { 
  Car, 
  Star, 
  Shield, 
  Zap, 
  Award,
  CreditCard,
  Users,
  Navigation,
  Crown
} from 'lucide-react';
import styles from './BookRide.module.css';

interface CarModel {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  image: string;
  category: 'economy' | 'premium' | 'luxury' | 'electric';
  features: string[];
  rating: number;
  available: boolean;
  premiumFeatures?: string[];
}

const BookRide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCar, setSelectedCar] = useState<CarModel | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  const carModels: CarModel[] = [
    {
      id: 1,
      name: 'Tesla Model S Plaid',
      brand: 'Tesla',
      year: 2024,
      price: 450,
      image: '/tesla-model-s.jpg',
      category: 'electric',
      features: ['Autopilot', 'Supercharging', 'Glass Roof', '21" Wheels'],
      rating: 4.9,
      available: true,
      premiumFeatures: ['Free Supercharging', 'Premium Connectivity', 'Enhanced Autopilot']
    },
    {
      id: 2,
      name: 'BMW iX xDrive50',
      brand: 'BMW',
      year: 2024,
      price: 380,
      image: '/bmw-ix.jpg',
      category: 'electric',
      features: ['iDrive 8.0', 'Curved Display', 'Panoramic Roof', 'Laser Lights'],
      rating: 4.8,
      available: true,
      premiumFeatures: ['BMW Live Cockpit', 'Gesture Control', 'Wireless Charging']
    },
    {
      id: 3,
      name: 'Mercedes-Benz EQS',
      brand: 'Mercedes-Benz',
      year: 2024,
      price: 420,
      image: '/mercedes-eqs.jpg',
      category: 'luxury',
      features: ['MBUX Hyperscreen', 'Burmester Sound', 'Ambient Lighting', 'Air Suspension'],
      rating: 4.9,
      available: true,
      premiumFeatures: ['Executive Rear Seats', 'Massage Functions', 'Head-up Display']
    },
    {
      id: 4,
      name: 'Porsche Taycan Turbo',
      brand: 'Porsche',
      year: 2024,
      price: 520,
      image: '/porsche-taycan.jpg',
      category: 'luxury',
      features: ['Porsche Dynamic Chassis', 'Sport Chrono', 'PASM', 'PCCB'],
      rating: 4.9,
      available: true,
      premiumFeatures: ['Porsche Track Precision', 'Sport Sound', 'Carbon Ceramic Brakes']
    },
    {
      id: 5,
      name: 'Audi e-tron GT',
      brand: 'Audi',
      year: 2024,
      price: 400,
      image: '/audi-etron-gt.jpg',
      category: 'premium',
      features: ['Virtual Cockpit', 'Bang & Olufsen Sound', 'Matrix LED', 'Quattro'],
      rating: 4.7,
      available: true,
      premiumFeatures: ['Audi Connect', 'Traffic Sign Recognition', 'Night Vision']
    },
    {
      id: 6,
      name: 'Ford Mustang Mach-E',
      brand: 'Ford',
      year: 2024,
      price: 280,
      image: '/ford-mach-e.jpg',
      category: 'electric',
      features: ['SYNC 4A', 'BlueCruise', 'B&O Sound', 'Panoramic Roof'],
      rating: 4.6,
      available: true,
      premiumFeatures: ['FordPass Connect', 'Connected Navigation', 'Remote Start']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Cars', icon: Car },
    { id: 'electric', label: 'Electric', icon: Zap },
    { id: 'luxury', label: 'Luxury', icon: Crown },
    { id: 'premium', label: 'Premium', icon: Award }
  ];

  const filteredCars = selectedCategory === 'all' 
    ? carModels 
    : carModels.filter(car => car.category === selectedCategory);

  const handleBookNow = (car: CarModel) => {
    setSelectedCar(car);
    setShowBookingModal(true);
    setBookingStep(1);
  };

  return (
    <div className={styles.bookRidePage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Book Your Dream Ride
            <span className={styles.heroHighlight}> Experience Luxury</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Choose from our premium collection of latest models. 
            Experience the future of driving with cutting-edge technology and unmatched comfort.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Premium Cars</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Support</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>4.9★</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        <div className={styles.filterContainer}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.categoryActive : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon size={20} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cars Grid */}
      <div className={styles.carsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Models Available</h2>
          <p className={styles.sectionSubtitle}>
            Handpicked premium vehicles with the latest technology and features
          </p>
        </div>

        <div className={styles.carsGrid}>
          {filteredCars.map((car) => (
            <div key={car.id} className={styles.carCard}>
              <div className={styles.carImage}>
                <img src={car.image} alt={car.name} />
                {car.category === 'electric' && (
                  <div className={styles.electricBadge}>
                    <Zap size={16} />
                    <span>Electric</span>
                  </div>
                )}
                {car.category === 'luxury' && (
                  <div className={styles.luxuryBadge}>
                    <Crown size={16} />
                    <span>Luxury</span>
                  </div>
                )}
              </div>

              <div className={styles.carInfo}>
                <div className={styles.carHeader}>
                  <h3 className={styles.carName}>{car.name}</h3>
                  <div className={styles.carRating}>
                    <Star size={16} className={styles.starIcon} />
                    <span>{car.rating}</span>
                  </div>
                </div>

                <p className={styles.carBrand}>{car.brand} • {car.year}</p>

                <div className={styles.carFeatures}>
                  {car.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className={styles.featureTag}>
                      {feature}
                    </span>
                  ))}
                </div>

                <div className={styles.carPricing}>
                  <div className={styles.priceInfo}>
                    <span className={styles.price}>${car.price}</span>
                    <span className={styles.priceUnit}>/day</span>
                  </div>
                  <button 
                    className={styles.bookButton}
                    onClick={() => handleBookNow(car)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Features Section */}
      <div className={styles.premiumSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose Our Premium Service?</h2>
          <p className={styles.sectionSubtitle}>
            Experience unmatched luxury and convenience with our premium features
          </p>
        </div>

        <div className={styles.premiumFeatures}>
          <div className={styles.premiumFeature}>
            <div className={styles.featureIcon}>
              <Shield size={32} />
            </div>
            <h3>Comprehensive Insurance</h3>
            <p>Full coverage insurance included with every booking for complete peace of mind.</p>
          </div>

          <div className={styles.premiumFeature}>
            <div className={styles.featureIcon}>
              <Navigation size={32} />
            </div>
            <h3>Concierge Service</h3>
            <p>24/7 concierge support for any assistance you need during your journey.</p>
          </div>

          <div className={styles.premiumFeature}>
            <div className={styles.featureIcon}>
              <Users size={32} />
            </div>
            <h3>Personal Driver</h3>
            <p>Professional chauffeur service available for the ultimate luxury experience.</p>
          </div>

          <div className={styles.premiumFeature}>
            <div className={styles.featureIcon}>
              <CreditCard size={32} />
            </div>
            <h3>Flexible Payment</h3>
            <p>Multiple payment options including installment plans for premium packages.</p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedCar && (
        <div className={styles.modalOverlay} onClick={() => setShowBookingModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Book {selectedCar.name}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              {bookingStep === 1 && (
                <div className={styles.bookingStep}>
                  <h3>Select Your Package</h3>
                  <div className={styles.packageOptions}>
                    <div className={styles.packageCard}>
                      <h4>Basic Package</h4>
                      <p className={styles.packagePrice}>${selectedCar.price}/day</p>
                      <ul>
                        <li>✓ Car rental</li>
                        <li>✓ Basic insurance</li>
                        <li>✓ 24/7 support</li>
                      </ul>
                      <button className={styles.packageButton}>Select Basic</button>
                    </div>

                    <div className={`${styles.packageCard} ${styles.premiumPackage}`}>
                      <div className={styles.premiumBadge}>Most Popular</div>
                      <h4>Premium Package</h4>
                      <p className={styles.packagePrice}>${selectedCar.price + 80}/day</p>
                      <ul>
                        <li>✓ Everything in Basic</li>
                        <li>✓ Premium insurance</li>
                        <li>✓ Personal driver</li>
                        <li>✓ Concierge service</li>
                      </ul>
                      <button className={styles.packageButton}>Select Premium</button>
                    </div>

                    <div className={styles.packageCard}>
                      <h4>Luxury Package</h4>
                      <p className={styles.packagePrice}>${selectedCar.price + 150}/day</p>
                      <ul>
                        <li>✓ Everything in Premium</li>
                        <li>✓ VIP treatment</li>
                        <li>✓ Airport pickup</li>
                        <li>✓ Custom itinerary</li>
                      </ul>
                      <button className={styles.packageButton}>Select Luxury</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRide; 