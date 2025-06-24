import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [emailSettings, setEmailSettings] = useState({
    bookingConfirmations: true,
    tournamentUpdates: true,
    teamInvitations: true,
    challengeAlerts: true,
    achievementNotifications: true,
    weeklyDigest: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchEmailSettings();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.getNotifications();
      setNotifications(response.data || [
        {
          id: 1,
          type: 'booking_confirmed',
          title: 'Court Booking Confirmed',
          message: 'Your booking for Downtown Court on Jan 15, 2024 at 6:00 PM has been confirmed.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          icon: '🏀'
        },
        {
          id: 2,
          type: 'tournament_update',
          title: 'Tournament Starting Soon',
          message: 'Summer Basketball Tournament starts in 2 hours. Good luck!',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: false,
          icon: '🏆'
        },
        {
          id: 3,
          type: 'achievement_earned',
          title: 'Achievement Unlocked!',
          message: 'You earned the "Court Master" achievement for booking 10 courts.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
          icon: '🎖️'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailSettings = async () => {
    try {
      const response = await api.getEmailSettings();
      setEmailSettings(response.data || emailSettings);
    } catch (error) {
      console.error('Failed to fetch email settings:', error);
    }
  };

  const updateEmailSettings = async (newSettings) => {
    try {
      await api.updateEmailSettings(newSettings);
      setEmailSettings(newSettings);
    } catch (error) {
      console.error('Failed to update email settings:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const sendTestEmail = async () => {
    try {
      await api.sendTestEmail(user.email);
      alert('Test email sent! Check your inbox.');
    } catch (error) {
      console.error('Failed to send test email:', error);
      alert('Failed to send test email. Please try again.');
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'booking_confirmed': return 'bg-green-500/20 border-green-500/50';
      case 'tournament_update': return 'bg-blue-500/20 border-blue-500/50';
      case 'team_invitation': return 'bg-purple-500/20 border-purple-500/50';
      case 'challenge_alert': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'achievement_earned': return 'bg-orange-500/20 border-orange-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded"></div>
            <div className="h-4 bg-white/5 rounded"></div>
            <div className="h-4 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Notifications */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <span>📧</span>
            <span>Notifications</span>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={sendTestEmail}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 text-sm"
            >
              Send Test Email
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-white font-bold mb-2">No Notifications</h3>
              <p className="text-gray-300">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-102 ${
                  getNotificationTypeColor(notification.type)
                } ${notification.read ? 'opacity-70' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{notification.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-bold text-sm">{notification.title}</h3>
                      <span className="text-gray-400 text-xs">{formatTimeAgo(notification.timestamp)}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{notification.message}</p>
                    {!notification.read && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-500/30 text-orange-300">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Email Preferences */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <span>⚙️</span>
          <span>Email Preferences</span>
        </h2>

        <div className="space-y-4">
          {Object.entries(emailSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <h3 className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </h3>
                <p className="text-gray-400 text-sm">
                  {getEmailDescription(key)}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => {
                    const newSettings = { ...emailSettings, [key]: e.target.checked };
                    updateEmailSettings(newSettings);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
          <div className="flex items-start space-x-2">
            <span className="text-blue-400 text-lg">💡</span>
            <div>
              <h3 className="text-blue-300 font-medium">Email Delivery</h3>
              <p className="text-blue-200 text-sm">
                Emails are sent to: <strong>{user?.email}</strong><br />
                Powered by SendGrid for reliable delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getEmailDescription = (key) => {
  const descriptions = {
    bookingConfirmations: 'Get notified when your court bookings are confirmed',
    tournamentUpdates: 'Receive updates about tournament schedules and results',
    teamInvitations: 'Be alerted when you\'re invited to join a team',
    challengeAlerts: 'Get notified about new challenges and match results',
    achievementNotifications: 'Celebrate your achievements and milestones',
    weeklyDigest: 'Weekly summary of your basketball activities'
  };
  return descriptions[key] || 'Email notification setting';
};

export default NotificationCenter;