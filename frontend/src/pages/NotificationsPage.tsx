import { useState, useEffect, useCallback } from 'react';
import { Bell, Search, RefreshCw, CheckCheck, BellRing, Plus, Send, X, Edit2, Trash2 } from 'lucide-react';
import { NotificationDTO, CreateNotificationRequestDTO } from '../types/notification';
import { notificationService } from '../services/notificationService';
import { NotificationCard, NotificationCardSkeleton } from '../components/NotificationCard';

type FilterType = 'all' | 'unread' | 'read';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);
  const [editingNotification, setEditingNotification] = useState<NotificationDTO | null>(null);
  const [formData, setFormData] = useState<CreateNotificationRequestDTO>({ 
    title: '', 
    message: '', 
    type: 'INFO',
    target: 'ALL_USERS'
  });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      let isAdminNow = false;
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          isAdminNow = userObj?.role === 'ADMIN';
          setCurrentUser(userObj);
        } catch (e) {
          console.error('Failed to parse user');
        }
      }
      const data = isAdminNow 
        ? await notificationService.getAllNotifications() 
        : await notificationService.getMyNotifications();
      const filteredData = data.filter(n => n.type !== 'SYSTEM');
      console.log('Fetched notifications:', filteredData);
      setNotifications(filteredData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    fetchNotifications();
  }, [fetchNotifications]);

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    setSubmitting(true);
    try {
      console.log('Submitting notification with data:', formData);
      if (editingNotification) {
        const updated = await notificationService.updateNotification(editingNotification.id, {
          title: formData.title,
          message: formData.message,
          type: formData.type
        });
        console.log('Notification updated:', updated);
      } else {
        const created = await notificationService.createNotification(formData);
        console.log('Notification created:', created);
      }
      resetForm();
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to save notification:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (notification: NotificationDTO) => {
    if (!confirm(`Delete "${notification.title}"?`)) return;
    try {
      if (notification.isBroadcast) {
        await notificationService.deleteBroadcastNotification(notification.id);
      } else {
        await notificationService.deleteNotification(notification.id);
      }
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification');
    }
  };

  const handleEdit = (notification: NotificationDTO) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type || 'INFO',
      target: notification.isBroadcast ? 'ALL_USERS' : 'USER'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', message: '', type: 'INFO', target: 'ALL_USERS' });
    setEditingNotification(null);
    setShowForm(false);
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'unread') return matchesSearch && !notification.isRead;
    if (filter === 'read') return matchesSearch && notification.isRead;
    return matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Notifications</h1>
          <p className="text-stone-500 mt-1">
            {isAdmin ? 'Manage and broadcast notifications to all users' : 'Stay updated with alerts and announcements'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Notification
            </button>
          )}
          {!isAdmin && unreadCount > 0 && (
            <button
              onClick={async () => {
                try {
                  await notificationService.markAllAsRead();
                  await fetchNotifications();
                } catch (error) {
                  console.error('Failed to mark all as read');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {showForm && isAdmin && (
        <div className="mb-8 bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800 font-serif">
              {editingNotification ? 'Edit Notification' : 'Broadcast New Notification'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notification title"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notification message..."
                rows={4}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
              >
                <option value="INFO">Info</option>
                <option value="WARNING">Warning</option>
                <option value="SUCCESS">Success</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Target</label>
              <select
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
              >
                <option value="ALL_USERS">All Users</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.title.trim() || !formData.message.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {editingNotification ? 'Update' : 'Broadcast'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8 max-w-xs">
          <div className="p-4 rounded-xl border bg-white border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-stone-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-stone-800">{notifications.length}</p>
                <p className="text-sm text-stone-500">Total Notifications</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <NotificationCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-800 mb-1">No notifications</h3>
          <p className="text-stone-500">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter' 
              : isAdmin ? 'Create your first broadcast notification' : 'You are all caught up!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isAdmin={isAdmin}
              onEdit={isAdmin ? () => handleEdit(notification) : undefined}
              onDelete={isAdmin ? () => handleDelete(notification) : undefined}
              onMarkRead={!isAdmin ? async () => {
                try {
                  await notificationService.markAsRead(notification.id);
                  await fetchNotifications();
                } catch (error) {
                  console.error('Failed to mark as read');
                }
              } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
