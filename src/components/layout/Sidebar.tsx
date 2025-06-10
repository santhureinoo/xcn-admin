import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  
  // For swipe gesture
  const touchStartX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [swiping, setSwiping] = useState(false);
  const [swipePosition, setSwipePosition] = useState(0);
  const sidebarWidth = 280;
  const minSwipeDistance = 50;
  const edgeThreshold = 30;
  
  // Check if the current path matches or starts with the given path
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/home';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'User Management', path: '/admin/users', icon: '👥' },
    { name: 'Package Management', path: '/admin/packages', icon: '📦' },
    { name: 'Currency Management', path: '/admin/currency', icon: '🪙' },
    { name: 'Transaction Management', path: '/admin/transactions', icon: '💰' },
    { name: 'Reports', path: '/admin/reports', icon: '📈' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  // Reset swipe state when sidebar is toggled programmatically
  useEffect(() => {
    if (!swiping) {
      setSwipePosition(isOpen ? sidebarWidth : 0);
    }
  }, [isOpen, swiping]);

  // Setup touch event listeners for swipe detection
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!isOpen && e.touches[0].clientX <= edgeThreshold) {
        touchStartX.current = e.touches[0].clientX;
        currentX.current = e.touches[0].clientX;
        setSwiping(true);
        setSwipePosition(0);
      } 
      else if (isOpen) {
        touchStartX.current = e.touches[0].clientX;
        currentX.current = e.touches[0].clientX;
        setSwiping(true);
        setSwipePosition(sidebarWidth);
      } else {
        touchStartX.current = null;
        currentX.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current !== null && currentX.current !== null) {
        e.preventDefault();
        
        currentX.current = e.touches[0].clientX;
        
        if (!isOpen) {
          const newPosition = Math.min(currentX.current - touchStartX.current, sidebarWidth);
          setSwipePosition(Math.max(0, newPosition));
        } else {
          const swipedLeft = touchStartX.current - currentX.current;
          const newPosition = Math.max(0, sidebarWidth - swipedLeft);
          setSwipePosition(newPosition);
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchStartX.current !== null && currentX.current !== null) {
        const distance = currentX.current - touchStartX.current;
        
        if (!isOpen && distance > minSwipeDistance) {
          toggleSidebar();
        } else if (isOpen && distance < -minSwipeDistance) {
          toggleSidebar();
        } else {
          setSwipePosition(isOpen ? sidebarWidth : 0);
        }
      }
      
      touchStartX.current = null;
      currentX.current = null;
      setSwiping(false);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, toggleSidebar]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xl font-semibold text-gray-800 dark:text-white">{t('appName')}</span>
        {isAdmin && (
          <span className="ml-2 px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
            ADMIN
          </span>
        )}
      </div>
      <nav className="flex-1 mt-5 px-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      
      {/* User info at bottom */}
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Mobile version with swipe gesture
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return (
      <>
        {/* Swipe indicator when sidebar is closed */}
        {!isOpen && !swiping && (
          <div 
            className="fixed top-1/2 left-0 transform -translate-y-1/2 h-24 w-2 bg-blue-500 dark:bg-blue-400 rounded-r-md opacity-30 z-20"
            aria-hidden="true"
          />
        )}
        
        {/* Custom swipeable sidebar */}
        <div 
          className={`fixed inset-0 z-50 ${(isOpen || swiping) ? 'visible' : 'invisible'}`}
          style={{
            pointerEvents: (isOpen || swiping) ? 'auto' : 'none',
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black transition-opacity duration-300"
            style={{
              opacity: swipePosition / sidebarWidth * 0.5,
              pointerEvents: swipePosition > 0 ? 'auto' : 'none'
            }}
            onClick={toggleSidebar}
          />
          
          {/* Sidebar */}
          <div 
            ref={sidebarRef}
            className="absolute top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${swipePosition - sidebarWidth}px)`,
              transition: swiping ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-gray-800 dark:text-white">{t('appName')}</span>
                {isAdmin && (
                  <span className="ml-2 px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
                    ADMIN
                  </span>
                )}
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="mt-5 px-2 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(item.path)
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={toggleSidebar}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            
            {/* User info at bottom for mobile */}
            {user && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Desktop version (fixed sidebar)
  return (
    <div className="hidden lg:block lg:w-64 bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;