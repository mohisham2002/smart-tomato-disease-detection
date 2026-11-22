import { useState, useEffect } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { NoticeDTO } from '../types/notification';
import { noticeService } from '../services/noticeService';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NoticeModal({ isOpen, onClose }: NoticeModalProps) {
  const [notices, setNotices] = useState<NoticeDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotices();
    }
  }, [isOpen]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await noticeService.getActiveNotices();
      setNotices(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'NEW_FEATURES':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return 'bg-amber-50 border-amber-200';
      case 'NEW_FEATURES':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800">System Notices</h2>
              {notices.length > 0 && (
                <p className="text-sm text-stone-500">{notices.length} notices</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-stone-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-stone-500">No notices</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-4 rounded-xl border ${getTypeColor(notice.type)} shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getTypeIcon(notice.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-800">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-stone-600 mt-1">{notice.message}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-stone-400">
                          {new Date(notice.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
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
