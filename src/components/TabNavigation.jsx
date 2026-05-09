import { useState, useCallback } from 'react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export default function TabNavigation({ activeTab, onTabChange }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const { selection } = useHapticFeedback();
  const tabs = [
    { id: 'kingdom', label: '🏰 Kingdom' },
    { id: 'army', label: '⚔️ Army' }
  ];

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTabChange = useCallback((tabId) => {
    onTabChange(tabId);
    selection();
  }, [onTabChange, selection]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    let newTabId = null;

    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      newTabId = tabs[currentIndex + 1].id;
    }
    if (isRightSwipe && currentIndex > 0) {
      newTabId = tabs[currentIndex - 1].id;
    }
    
    if (newTabId) {
      handleTabChange(newTabId);
    }
  }, [touchStart, touchEnd, activeTab, tabs, handleTabChange]);

  return (
    <div 
      className="tab-navigation"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => handleTabChange(tab.id)}
          aria-selected={activeTab === tab.id}
          aria-label={`Switch to ${tab.label} tab`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}