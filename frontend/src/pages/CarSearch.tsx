import React, { useState, useRef, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import CarCard from '../components/CarCard';
import type { Car } from '../api/cars';
import { chatCarSearch } from '../api/cars';
import { User, Bot, Car as CarIcon, Sparkles, Filter, Zap, Award, DollarSign, Calendar, ChevronRight, Star, X, Search, Compass, Shield, Clock, Menu, Home, Settings } from 'lucide-react';
import styles from './CarSearch.module.css';
import logo from '../assets/logo.webp';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  cars?: Car[];
  query?: string;
}

// Navigation items for sidebar
const navigationItems = [
  { id: 'chat', label: 'AI Chat', icon: Sparkles, color: '#3b82f6' },
  { id: 'book-ride', label: 'Book Ride', icon: CarIcon, color: '#10b981' },
  { id: 'my-bookings', label: 'My Bookings', icon: Calendar, color: '#f59e0b' },
  { id: 'profile', label: 'Profile', icon: User, color: '#8b5cf6' },
  { id: 'settings', label: 'Settings', icon: Settings, color: '#6b7280' }
];

const CarSearch: React.FC = () => {
  const [activeView, setActiveView] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([{
      id: 1,
    text: "Hi there! I'm your AI car search assistant. I can help you find the perfect vehicle based on your specific needs and preferences. What kind of car are you looking for today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [activeFuelFilter, setActiveFuelFilter] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages, loading]);

  const handleFuelFilter = (fuelType: string) => {
    if (activeFuelFilter === fuelType) {
      setActiveFuelFilter(null);
    } else {
      setActiveFuelFilter(fuelType);
    }
  };

  const handleSend = async (query: string) => {
    if (!query.trim() || loading) return;
    
    let finalQuery = query;
    if (activeFuelFilter) {
      finalQuery = `${query} ${activeFuelFilter} cars`;
    }
    
    const userMsg: ChatMessage = {
      id: Date.now(),
      text: query,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await chatCarSearch(finalQuery);
      if (Array.isArray(res)) {
        if (res.length > 0) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              text: `I found ${res.length} car${res.length !== 1 ? 's' : ''} that match your search criteria. Here are the results:`,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
              id: Date.now() + 2,
              text: '',
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              cars: res,
              query: finalQuery
            }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              text: "I couldn't find any cars matching your criteria. Try adjusting your search parameters or browse our available inventory.",
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } else if ('message' in res) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            text: res.message,
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Sorry, I encountered an error while searching. Please try again.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatBoxSend = (query: string) => handleSend(query);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: Date.now(),
      text: "Hi there! I'm your AI car search assistant. I can help you find the perfect vehicle based on your specific needs and preferences. What kind of car are you looking for today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInput('');
  };

  const showSuggestions = messages.length === 1 && !loading;

  // Render different content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'chat':
  return (
          <div className={styles['carsearch-chat-content']}>
            {/* Chat Prompt */}
            <div className={styles['carsearch-chat-prompt']}>
              Hi, I'm AI Car Agent.<br />
              How can I help you today?
          </div>

            {/* Messages and Car Cards */}
            <div className={styles['carsearch-messages']}>
              <div className={styles['carsearch-messages-inner']}>
          {showSuggestions && (
                  <div className={styles['carsearch-suggestions']}>
              <SuggestedQueries onSelectQuery={handleSend} />
            </div>
          )}
                {messages.map((msg, idx) => (
            <div key={msg.id}>
              {msg.cars ? (
                      <CarResults cars={msg.cars} feature={msg.query} />
                    ) : (
                      idx > 0 && <MessageBubble message={msg} />
                    )}
                  </div>
                ))}
                {loading && <TypingIndicator />}
                <div ref={messagesEndRef} />
                    </div>
                        </div>

            {/* Chat Input */}
            <div className={styles['carsearch-input']}>
              <div className={styles['carsearch-input-inner']}>
                <ChatBox 
                  onSend={handleChatBoxSend} 
                  loading={loading}
                  onFuelFilter={handleFuelFilter}
                  activeFuelFilter={activeFuelFilter}
                />
                    </div>
                  </div>
                </div>
        );
      
      case 'book-ride':
        return <BookRideContent />;
      
      case 'my-bookings':
        return <MyBookingsContent />;
      
      case 'profile':
        return <ProfileContent />;
      
      case 'settings':
        return <SettingsContent />;
      
      default:
        return null;
    }
  };

  return (
    <div className={styles['carsearch-root-with-sidebar']}>
      {/* Mobile Menu Button */}
      <button 
        className={styles.mobileMenuButton}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img src={logo} alt="Logo" style={{ width: 60, height: 60, objectFit: 'contain' }} />
            <span className={styles.logoText}>CarDrive</span>
          </div>
            </div>

        <nav className={styles.navigation}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeView === item.id ? styles.navItemActive : ''}`}
              onClick={() => setActiveView(item.id)}
              style={{ '--accent-color': item.color } as React.CSSProperties}
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
        {renderContent()}
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Placeholder components for other views
const BookRideContent = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Book Your Ride</h1>
    <p style={{ color: '#666' }}>Premium car booking interface coming soon...</p>
  </div>
);

const MyBookingsContent = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>My Bookings</h1>
    <p style={{ color: '#666' }}>Your booking history will appear here...</p>
  </div>
);

const ProfileContent = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Profile</h1>
    <p style={{ color: '#666' }}>Profile management coming soon...</p>
  </div>
);

const SettingsContent = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Settings</h1>
    <p style={{ color: '#666' }}>App settings coming soon...</p>
      </div>
);

// Keep existing components
const SuggestedQueries = ({ onSelectQuery }: { onSelectQuery: (query: string) => void }) => {
  const suggestions = [
    { icon: Zap, text: "Show me the latest model of tesla", color: "from-green-500 to-emerald-600" },
    { icon: Award, text: "Find top 2 electric cars", color: "from-purple-500 to-indigo-600" },
    { icon: DollarSign, text: "Search for BMW cars", color: "from-blue-500 to-cyan-600" },
    { icon: Calendar, text: "Show me all Tesla models", color: "from-orange-500 to-red-600" }
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Popular Searches</h3>
        </div>
        <p className="text-sm text-gray-500">Try one of these to get started</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSelectQuery(suggestion.text)}
            className="group relative overflow-hidden bg-white hover:bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${suggestion.color} flex items-center justify-center text-white shadow-lg`}>
                <suggestion.icon size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                  {suggestion.text}
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const MessageBubble = ({ message }: { message: ChatMessage }) => (
  message.isUser ? (
    <div className={styles['user-message']}>
      <div className={styles['user-bubble']}>
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
    </div>
  ) : (
    <div className={`flex gap-3 mb-6 flex-row animate-in slide-in-from-bottom-2 duration-500`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600`}>
        <Sparkles size={20} className="text-blue-600" />
      </div>
      <div className={`max-w-[75%]`}>
        <div className={`rounded-2xl px-5 py-3 shadow-sm bg-white text-gray-800 rounded-bl-md border border-gray-100`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
      </div>
    </div>
  )
);

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', margin: '1.2rem 0' }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Sparkles size={20} color="#6b7280" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: 'dotPulse 1.2s infinite', animationDelay: '0s' }} />
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: 'dotPulse 1.2s infinite', animationDelay: '0.2s' }} />
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: 'dotPulse 1.2s infinite', animationDelay: '0.4s' }} />
    </div>
    <style>{`
      @keyframes dotPulse {
        0%, 100% { background: #d1d5db; }
        50% { background: #6b7280; }
      }
    `}</style>
  </div>
);

const DEFAULT_LIMIT = 3;

function CarResults({ cars, feature }: { cars: Car[]; feature?: string }) {
  const [showAll, setShowAll] = useState(false);

  const visibleCars = showAll ? cars : cars.slice(0, DEFAULT_LIMIT);
  const shouldShowMore = cars.length > DEFAULT_LIMIT && !showAll;
  const shouldShowLess = cars.length > DEFAULT_LIMIT && showAll;

  return (
    <div>
      <div className={styles['carsearch-bot-cars']} style={{ display: 'flex', flexDirection: 'column' }}>
        {visibleCars.map((car, idx) => (
          <div key={car.id} className={styles['carsearch-bot-car']} style={{ position: 'relative' }}>
            <CarCard car={car} />
            {shouldShowMore && idx === visibleCars.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 4,
                cursor: 'pointer',
                color: '#2563eb',
                fontSize: 13,
                fontWeight: 500,
                gap: 2
              }}
              onClick={() => setShowAll(true)}
              >
                <span style={{ marginRight: 2 }}>see more</span>
                <ChevronRight size={15} />
              </div>
            )}
            {shouldShowLess && idx === visibleCars.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 4,
                cursor: 'pointer',
                color: '#2563eb',
                fontSize: 13,
                fontWeight: 500,
                gap: 2
              }}
              onClick={() => setShowAll(false)}
              >
                <span style={{ marginRight: 2 }}>see less</span>
                <ChevronRight size={15} style={{ transform: 'rotate(180deg)' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarSearch;