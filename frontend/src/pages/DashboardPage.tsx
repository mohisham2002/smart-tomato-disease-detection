import { useState, useEffect, useCallback } from 'react';
import { 
  Leaf, 
  Image,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Bell,
  BellRing,
  Calendar,
  CheckCheck,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DetectionHistoryDTO } from '../types/detection';
import { LeafImageDTO } from '../types/leafImage';
import { NotificationDTO } from '../types/notification';
import { detectionService } from '../services/detectionService';
import { leafImageService } from '../services/leafImageService';
import { notificationService } from '../services/notificationService';
import { noticeService } from '../services/noticeService';
import { NoticeModal } from '../components/NoticeModal';

export function DashboardPage() {
  const [detections, setDetections] = useState<DetectionHistoryDTO[]>([]);
  const [images, setImages] = useState<LeafImageDTO[]>([]);
  const [allImages, setAllImages] = useState<LeafImageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);
  const [noticeCount, setNoticeCount] = useState(0);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [recentNotices, setRecentNotices] = useState<NotificationDTO[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<NotificationDTO[]>([]);

  const isAdmin = currentUser?.role === 'ADMIN';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }

      const lastViewed = localStorage.getItem('noticesLastViewed');

      if (isAdmin) {
        const [allImagesData, noticesData] = await Promise.all([
          leafImageService.getAllImages(),
          noticeService.getActiveNotices()
        ]);
        setAllImages(allImagesData);
        setRecentNotices(noticesData.slice(0, 5));
      } else {
        const [detectionsData, imagesData, notificationsData, noticesData] = await Promise.all([
          detectionService.getMyDetections(),
          leafImageService.getMyImages(),
          notificationService.getMyNotifications(),
          noticeService.getActiveNotices()
        ]);
        setDetections(detectionsData);
        setImages(imagesData);
        setRecentNotifications(notificationsData.slice(0, 5));
        
        const noticesSinceViewed = noticesData.filter(notice => {
          if (!lastViewed) return true;
          return new Date(notice.createdAt).getTime() > new Date(lastViewed).getTime();
        });
        setNoticeCount(noticesSinceViewed.length);
      }
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchData]);

  const myDetections = detections;
  const myImages = images;
  const thisMonthDetections = myDetections.filter(d => {
    const detectionDate = new Date(d.detectedAt);
    const now = new Date();
    return detectionDate.getMonth() === now.getMonth() && 
           detectionDate.getFullYear() === now.getFullYear();
  });

  const healthyCount = myDetections.filter(d => d.result === 'Healthy').length;
  const diseasedCount = myDetections.filter(d => d.result !== 'Healthy').length;
  const healthScore = myDetections.length > 0 
    ? Math.round((healthyCount / myDetections.length) * 100) 
    : 0;

  const recentDetections = myDetections.slice(0, 6);

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const imagesToday = allImages.filter(img => {
    const imgDate = new Date(img.uploadedAt);
    return imgDate >= todayStart;
  });

  const imagesThisMonth = allImages.filter(img => {
    const imgDate = new Date(img.uploadedAt);
    return imgDate >= thisMonthStart;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-stone-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-stone-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-800">Dashboard</h1>
            <p className="text-stone-500 mt-1">
              Welcome back, {currentUser?.name || 'Admin'}!
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Image className="w-6 h-6 text-green-600" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Today
              </span>
            </div>
            <p className="text-3xl font-bold text-stone-800">{imagesToday.length}</p>
            <p className="text-sm text-stone-500 mt-1">Images Uploaded Today</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                This Month
              </span>
            </div>
            <p className="text-3xl font-bold text-stone-800">{imagesThisMonth.length}</p>
            <p className="text-sm text-stone-500 mt-1">Images This Month</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Image className="w-6 h-6 text-purple-600" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                All Time
              </span>
            </div>
            <p className="text-3xl font-bold text-stone-800">{allImages.length}</p>
            <p className="text-sm text-stone-500 mt-1">Total Images Uploaded</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-800 font-serif mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link
                to="/notifications"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">Create New Notification</p>
                    <p className="text-sm text-stone-500">Broadcast notification to users</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-blue-600" />
              </Link>

              <Link
                to="/notices"
                className="flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BellRing className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">Create New Notice</p>
                    <p className="text-sm text-stone-500">Broadcast system notice</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-purple-600" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-stone-800 font-serif">Recently Published Notices</h3>
              <Link
                to="/notices"
                className="text-sm text-forest-600 hover:text-forest-700 font-medium"
              >
                View All
              </Link>
            </div>
            {recentNotices.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BellRing className="w-6 h-6 text-stone-400" />
                </div>
                <p className="text-stone-500 text-sm">No notices published yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 bg-stone-50 rounded-xl border border-stone-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-stone-800">{notice.title}</p>
                        <p className="text-sm text-stone-500 mt-1 line-clamp-1">{notice.message}</p>
                        <p className="text-xs text-stone-400 mt-2">
                          {new Date(notice.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        notice.type === 'MAINTENANCE' ? 'bg-amber-100 text-amber-700' :
                        notice.type === 'NEW_FEATURES' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {notice.type === 'MAINTENANCE' ? 'Maintenance' :
                         notice.type === 'NEW_FEATURES' ? 'New Features' : 'Updates'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Dashboard</h1>
          <p className="text-stone-500 mt-1">
            Welcome back, {currentUser?.name || 'User'}!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              localStorage.setItem('noticesLastViewed', new Date().toISOString());
              setNoticeCount(0);
              setShowNoticeModal(true);
            }}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Notices
            {noticeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {noticeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
              healthScore >= 70 ? 'bg-green-100 text-green-700' : 
              healthScore >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            }`}>
              {healthScore >= 70 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Poor'}
            </span>
          </div>
          <p className="text-3xl font-bold text-stone-800">{healthScore}%</p>
          <p className="text-sm text-stone-500 mt-1">Health Score</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
            <span className="text-sm text-green-600">{healthyCount} healthy</span>
            <span className="text-sm text-stone-400">•</span>
            <span className="text-sm text-red-600">{diseasedCount} diseased</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-blue-600" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              This Month
            </span>
          </div>
          <p className="text-3xl font-bold text-stone-800">{thisMonthDetections.length}</p>
          <p className="text-sm text-stone-500 mt-1">Detections This Month</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
            <span className="text-sm text-stone-600">{myDetections.length} total</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-forest-600" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-forest-100 text-forest-700 text-xs font-medium rounded-full">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold text-stone-800">{myDetections.length}</p>
          <p className="text-sm text-stone-500 mt-1">My Detections</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
            <span className="text-sm text-green-600">{healthyCount} healthy</span>
            <span className="text-sm text-stone-400">•</span>
            <span className="text-sm text-red-600">{diseasedCount} diseased</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              Uploaded
            </span>
          </div>
          <p className="text-3xl font-bold text-stone-800">{myImages.length}</p>
          <p className="text-sm text-stone-500 mt-1">My Images</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
            <span className="text-sm text-stone-600">{images.length} uploaded</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-800 font-serif mb-4">Health Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-600">Healthy Leaves</span>
                <span className="text-sm font-semibold text-green-600">{healthyCount}</span>
              </div>
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${myDetections.length > 0 ? (healthyCount / myDetections.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-600">Diseased Leaves</span>
                <span className="text-sm font-semibold text-red-600">{diseasedCount}</span>
              </div>
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${myDetections.length > 0 ? (diseasedCount / myDetections.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-800 font-serif mb-4">Recent Notifications</h3>
          {recentNotifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-stone-400" />
              </div>
              <p className="text-stone-500 text-sm">No recent notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-sm font-medium text-stone-800">{notification.title}</p>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">{notification.message}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NoticeModal isOpen={showNoticeModal} onClose={() => setShowNoticeModal(false)} />
    </div>
  );
}
