import React, { useState } from 'react';
import styles from './ChatBox.module.css';
import { ArrowUp } from 'lucide-react';

type ChatBoxProps = {
  onSend: (query: string) => void;
  loading?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFuelFilter?: (fuelType: string) => void;
  activeFuelFilter?: string | null;
};

const ChatBox: React.FC<ChatBoxProps> = ({ 
  onSend, 
  loading, 
  value, 
  onChange, 
  onFuelFilter, 
  activeFuelFilter 
}) => {
  const [input, setInput] = useState('');
  const controlled = typeof value === 'string' && typeof onChange === 'function';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = controlled ? value : input;
    if (!val.trim()) return;
    onSend(val.trim());
    if (!controlled) setInput('');
  };

  const handleFuelFilter = (fuelType: string) => {
    if (onFuelFilter) {
      onFuelFilter(fuelType);
    }
  };

  return (
    <div className={styles['chatbox-outer']}> {/* Styled container to look like input */}
      <form onSubmit={handleSubmit} className={styles['chatbox-form']} autoComplete="off">
        <div className={styles['chatbox-inner']}>
      <input
        type="text"
            className={styles['chatbox-input']}
            placeholder="Searching for a brand new car ..."
        value={controlled ? value : input}
        onChange={controlled ? onChange : e => setInput(e.target.value)}
        disabled={loading}
        autoFocus
      />
      <button
        type="submit"
            className={styles['chatbox-send-btn']}
        disabled={loading || !(controlled ? value : input).trim()}
      >
            {loading ? '...' : <ArrowUp size={16} />}
          </button>
        </div>
        {/* Tags row inside the same container, below the input */}
        <div className={styles['chatbox-tags-row']}>
          {[
            { id: 'electric', label: 'Electric', color: '#10B981' },
            { id: 'hybrid', label: 'Hybrid', color: '#3B82F6' },
            { id: 'petrol', label: 'Petrol', color: '#F59E0B' },
            { id: 'diesel', label: 'Diesel', color: '#6B7280' }
          ].map(filter => (
            <button
              key={filter.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleFuelFilter(filter.id);
              }}
              className={
                activeFuelFilter === filter.id
                  ? styles['chatbox-tag-active']
                  : styles['chatbox-tag']
              }
              style={{ background: activeFuelFilter === filter.id ? filter.color : undefined }}
            >
              {filter.label}
      </button>
          ))}
        </div>
    </form>
    </div>
  );
};

export default ChatBox; 