import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Car, 
  Calendar, 
  User, 
  Settings, 
  Menu, 
  X,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  CreditCard
} from 'lucide-react';
import styles from './Dashboard.module.css';

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'book-ride', label: 'Book Ride', icon: Car, path: '/book-ride' },
    { id: 'my-bookings', label: 'My Bookings', icon: Calendar, path: '/my-bookings' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const getActivePage = () => {
    const currentPath = location.pathname;
    const activeItem = navigationItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.id : 'home';
  };

  return (
    <div className={styles.dashboard}>
      {/* Mobile Menu Button */}
      <button 
        className={styles.mobileMenuButton}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Car size={32} className={styles.logoIcon} />
            <span className={styles.logoText}>CarDrive</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${getActivePage() === item.id ? styles.navItemActive : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              <ChevronRight size={16} className={styles.navArrow} />
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={20} />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>John Doe</span>
              <span className={styles.userEmail}>john@example.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {children || <DashboardHome />}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

// Dashboard Home Component
const DashboardHome: React.FC = () => {
  const stats = [
    { label: 'Total Bookings', value: '24', icon: Calendar, color: '#3b82f6' },
    { label: 'Completed Rides', value: '18', icon: Car, color: '#10b981' },
    { label: 'Pending', value: '3', icon: Clock, color: '#f59e0b' },
    { label: 'Total Spent', value: '$2,450', icon: CreditCard, color: '#8b5cf6' }
  ];

  const recentBookings = [
    {
      id: 1,
      car: 'Tesla Model 3',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'completed',
      price: '$120'
    },
    {
      id: 2,
      car: 'BMW X5',
      date: '2024-01-20',
      time: '2:30 PM',
      status: 'upcoming',
      price: '$180'
    },
    {
      id: 3,
      car: 'Audi A4',
      date: '2024-01-25',
      time: '9:00 AM',
      status: 'pending',
      price: '$95'
    }
  ];

  return (
    <div className={styles.dashboardHome}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back! Here's what's happening with your rides.</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>
              <stat.icon size={24} color="white" />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className={styles.recentBookings}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Bookings</h2>
          <button className={styles.viewAllButton}>View All</button>
        </div>
        
        <div className={styles.bookingsList}>
          {recentBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingInfo}>
                <h3 className={styles.carName}>{booking.car}</h3>
                <div className={styles.bookingDetails}>
                  <span className={styles.bookingDate}>{booking.date}</span>
                  <span className={styles.bookingTime}>{booking.time}</span>
                </div>
              </div>
              <div className={styles.bookingStatus}>
                <span className={`${styles.statusBadge} ${styles[`status${booking.status}`]}`}>
                  {booking.status}
                </span>
                <span className={styles.bookingPrice}>{booking.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 