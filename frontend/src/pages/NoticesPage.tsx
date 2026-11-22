import { useState, useEffect, useCallback } from 'react';
import { Bell, Search, RefreshCw, Plus, Send, X, Edit2, Trash2, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { NoticeDTO, CreateNoticeRequestDTO, UpdateNoticeRequestDTO } from '../types/notification';
import { noticeService } from '../services/noticeService';

type NoticeType = 'UPDATES' | 'MAINTENANCE' | 'NEW_FEATURES';

export function NoticesPage() {
  const [notices, setNotices] = useState<NoticeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeDTO | null>(null);
  const [formData, setFormData] = useState<CreateNoticeFormData>({
    title: '',
    message: '',
    type: 'UPDATES'
  });

  interface CreateNoticeFormData {
    title: string;
    message: string;
    type: NoticeType;
  }

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await noticeService.getAllNotices();
      console.log('Fetched notices:', data);
      setNotices(data);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    setSubmitting(true);
    try {
      if (editingNotice) {
        const updated = await noticeService.updateNotice(editingNotice.id, {
          title: formData.title,
          message: formData.message,
          type: formData.type
        });
        console.log('Notice updated:', updated);
      } else {
        const created = await noticeService.createNotice({
          title: formData.title,
          message: formData.message,
          type: formData.type
        });
        console.log('Notice created:', created);
      }
      resetForm();
      await fetchNotices();
    } catch (error) {
      console.error('Failed to save notice:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (notice: NoticeDTO) => {
    if (!confirm(`Delete "${notice.title}"?`)) return;
    try {
      await noticeService.deleteNotice(notice.id);
      await fetchNotices();
    } catch (error) {
      console.error('Failed to delete notice');
    }
  };

  const handleEdit = (notice: NoticeDTO) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      message: notice.message,
      type: notice.type === 'MAINTENANCE' ? 'MAINTENANCE' : notice.type === 'NEW_FEATURES' ? 'NEW_FEATURES' : 'UPDATES'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', message: '', type: 'UPDATES' });
    setEditingNotice(null);
    setShowForm(false);
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'NEW_FEATURES':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">System Notices</h1>
          <p className="text-stone-500 mt-1">Broadcast system notices to all users</p>
        </div>
        <div className="flex items-center gap-3">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Notice
            </button>
          )}
          <button
            onClick={fetchNotices}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800 font-serif">
              {editingNotice ? 'Edit Notice' : 'Broadcast New Notice'}
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
                placeholder="Notice title.."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notice message..."
                rows={4}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as NoticeType })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
              >
                <option value="UPDATES">Updates</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="NEW_FEATURES">New Features</option>
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
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {editingNotice ? 'Update' : 'Broadcast'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-200 p-6 animate-pulse">
              <div className="h-5 bg-stone-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-stone-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-800 mb-1">No notices yet</h3>
          <p className="text-stone-500">
            {searchTerm ? 'Try adjusting your search' : 'Broadcast your first system notice'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl border border-stone-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(notice.type)}`}>
                    {getTypeIcon(notice.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-800">{notice.title}</h3>
                    <p className="text-stone-600 mt-1">{notice.message}</p>
                    <p className="text-sm text-stone-400 mt-2">
                      {new Date(notice.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(notice)}
                    className="p-2 text-stone-400 hover:text-forest-600 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(notice)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
