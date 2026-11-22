import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Search, RefreshCw, Plus, Send, X } from 'lucide-react';
import { FeedbackDTO, CreateFeedbackRequestDTO } from '../types/feedback';
import { feedbackService } from '../services/feedbackService';
import { FeedbackCard, FeedbackCardSkeleton } from '../components/FeedbackCard';

type FilterType = 'all' | 'PENDING' | 'RESOLVED' | 'SPAM';

export function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateFeedbackRequestDTO>({ subject: '', message: '' });
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);

  const isAdmin = currentUser?.role === 'ADMIN';

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      let isAdminNow = false;
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          isAdminNow = userObj?.role === 'ADMIN';
        } catch (e) {
          console.error('Failed to parse user from localStorage');
        }
      }
      const data = isAdminNow 
        ? await feedbackService.getAllFeedback() 
        : await feedbackService.getMyFeedback();
      setFeedbackList(data);
    } catch (error) {
      console.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    fetchFeedback();
  }, [fetchFeedback]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchFeedback();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) return;

    setSubmitting(true);
    try {
      await feedbackService.createFeedback(formData);
      setFormData({ subject: '', message: '' });
      setShowForm(false);
      await fetchFeedback();
    } catch (error) {
      console.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await feedbackService.updateFeedbackStatus(id, { status });
      await fetchFeedback();
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const handleDelete = async (feedback: FeedbackDTO) => {
    if (!confirm(`Delete feedback "${feedback.subject}"?`)) return;
    try {
      await feedbackService.deleteFeedback(feedback.id);
      await fetchFeedback();
    } catch (error) {
      console.error('Failed to delete feedback');
    }
  };

  const filteredFeedback = feedbackList.filter((feedback) => {
    const matchesSearch = 
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && feedback.status === filter;
  });

  const pendingCount = feedbackList.filter(f => f.status === 'PENDING').length;
  const approvedCount = feedbackList.filter(f => f.status === 'APPROVED').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Feedback</h1>
          <p className="text-stone-500 mt-1">Submit and manage your feedback</p>
        </div>
        <div className="flex items-center gap-3">
          {!showForm && !isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Feedback
            </button>
          )}
          <button
            onClick={fetchFeedback}
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
            <h2 className="text-lg font-semibold text-stone-800 font-serif">Submit New Feedback</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your feedback"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your feedback in detail..."
                rows={4}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all resize-none"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.subject.trim() || !formData.message.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl border transition-all ${
              filter === 'all'
                ? 'bg-forest-50 border-forest-200 shadow-sm'
                : 'bg-white border-stone-200 hover:border-forest-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-stone-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-stone-800">{feedbackList.length}</p>
                <p className="text-sm text-stone-500">Total</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilter('PENDING')}
            className={`p-4 rounded-xl border transition-all ${
              filter === 'PENDING'
                ? 'bg-amber-50 border-amber-200 shadow-sm'
                : 'bg-white border-stone-200 hover:border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
                <p className="text-sm text-stone-500">Pending</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilter('RESOLVED')}
            className={`p-4 rounded-xl border transition-all ${
              filter === 'RESOLVED'
                ? 'bg-green-50 border-green-200 shadow-sm'
                : 'bg-white border-stone-200 hover:border-green-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
                <p className="text-sm text-stone-500">Approved</p>
              </div>
            </div>
          </button>
        </div>
      )}

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <FeedbackCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredFeedback.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-800 mb-1">No feedback found</h3>
          <p className="text-stone-500">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter' 
              : isAdmin ? 'No feedback submitted yet' : 'Be the first to submit feedback!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedback.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              isAdmin={isAdmin}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
