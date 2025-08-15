import React from 'react';
import { X, Bell } from 'lucide-react';
import { Theme } from '../App';

interface NotificationModalProps {
  theme: Theme;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ theme, onClose }) => {
  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'New experiment template available',
      message: 'Check out our new Chemistry lab template for virtual experiments.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Your experiment was featured',
      message: 'Congratulations! Your "Gravity Simulation" experiment was featured on our homepage.',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      title: 'System maintenance',
      message: 'The platform will be under maintenance on Sunday from 2-4 AM UTC.',
      time: '3 days ago',
      read: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div 
        className={`relative rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center">
            <Bell size={18} className="mr-2" />
            Notifications
          </h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg ${
                    notification.read 
                      ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50' 
                      : theme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'
                  } ${
                    !notification.read && 'border-l-4 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${!notification.read && 'font-semibold'}`}>
                      {notification.title}
                    </h3>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {notification.time}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell size={40} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                No notifications yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;