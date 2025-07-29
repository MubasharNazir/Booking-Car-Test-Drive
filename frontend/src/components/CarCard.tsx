import React, { useState } from 'react';
import { Info, ChevronLeft, ChevronRight, Calendar, DollarSign } from 'lucide-react';
import styles from './CarCard.module.css';
import hid1 from '../assets/hid1.webp';
import hidImg from '../assets/hid.jpg';

interface Car {
  company_name: string;
  model: string;
  year: number;
  price: number;
  condition?: string;
  description: string;
  available_for_test_drive: boolean;
  features: string[];
  images?: string[];
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  // Always use hid.jpg from assets twice
  const images = [hid1, hidImg];

  const handlePrev = () => setImgIdx(i => (i === 0 ? images.length - 1 : i - 1));
  const handleNext = () => setImgIdx(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.cardBackground} />
        <button className={styles.viewDetailsButton} type="button">
          View Details
        </button>
        <div className={styles.cardContent}>
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <img
                src={images[imgIdx]}
                alt={`${car.company_name} ${car.model}`}
                className={styles.carImage}
              />
              <div className={styles.imageOverlay} />
              {/* Always show arrows if more than one image */}
              {images.length > 1 && (
                <>
                  <button onClick={handlePrev} className={styles.navButtonLeft} type="button">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={handleNext} className={styles.navButtonRight} type="button">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              {images.length > 1 && (
                <div className={styles.imageIndicators}>
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`${styles.indicator} ${i === imgIdx ? styles.activeIndicator : ''}`}
                    />
                  ))}
                </div>
        )}
      </div>
          </div>
          <div className={styles.contentSection}>
            <div className={styles.header}>
              <div className={styles.titleRow}>
                <h2 className={styles.carTitle}>
                  {car.company_name} {car.model}
                  <button
                    className={styles.infoButton}
                    onMouseEnter={() => setShowInfo(true)}
                    onMouseLeave={() => setShowInfo(false)}
                  >
                    <Info size={16} />
                    {showInfo && (
                      <div
                        className={styles.infoPopup}
                        onMouseEnter={() => setShowInfo(true)}
                        onMouseLeave={() => setShowInfo(false)}
                      >
                        <div className={styles.infoPopupArrow} />
                        <h3 className={styles.infoPopupTitle}>
                          {car.company_name} {car.model}
                        </h3>
                        <p className={styles.infoPopupDescription}>
                          {car.description}
                        </p>
                      </div>
                    )}
                  </button>
                </h2>
          {/* {car.available_for_test_drive && (
                  <span className={styles.testDriveBadge}>
                    <Calendar size={12} />
                    Test Drive
                  </span>
          )} */}
        </div>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <Calendar size={14} className={styles.calendarIcon} />
                  <span className={styles.statValue}>{car.year}</span>
                </div>
                <div className={styles.statItem}>
                  <DollarSign size={14} className={styles.dollarIcon} />
                  <span className={styles.statValue}>${car.price.toLocaleString()}</span>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.conditionIndicator}>
                    <div className={styles.conditionDot} />
                  </div>
                  <span className={styles.conditionText}>{car.condition || 'Brand New'}</span>
                </div>
        </div>
              {car.features && car.features.length > 0 && (
                <div className={styles.featuresContainer}>
                  {car.features.slice(0, 4).map((feature, i) => (
                    <span key={i} className={styles.featureBadge}>
                      {feature}
                    </span>
                  ))}
                  {car.features.length > 4 && (
                    <span className={styles.moreFeaturesBadge}>
                      +{car.features.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <button className={styles.ctaButton}>
              <div className={styles.ctaButtonHoverBg} />
              <div className={styles.ctaButtonShine} />
              <span className={styles.ctaButtonContent}>
                Book Test Drive
                <Calendar size={14} className={styles.ctaButtonIcon} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.floatingEffectTopRight} />
      <div className={styles.floatingEffectBottomLeft} />
    </div>
  );
};

export default CarCard; 