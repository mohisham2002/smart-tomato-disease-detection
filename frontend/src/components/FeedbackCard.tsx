import { useState } from 'react';
import { MessageSquare, User, Calendar, Trash2, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { FeedbackDTO } from '../types/feedback';

interface FeedbackCardProps {
  feedback: FeedbackDTO;
  isAdmin?: boolean;
  onUpdateStatus?: (id: number, status: string) => void;
  onDelete?: (feedback: FeedbackDTO) => void;
}

export function FeedbackCard({ feedback, isAdmin, onUpdateStatus, onDelete }: FeedbackCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = () => {
    switch (feedback.status?.toUpperCase()) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'SPAM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            Spam
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200 p-6 transition-all duration-300 hover:shadow-md hover:border-forest-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-forest-600" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-800 font-serif">{feedback.subject}</h3>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <User className="w-3.5 h-3.5" />
              <span>{feedback.userName}</span>
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <p className={`text-stone-600 text-sm ${!isExpanded ? 'line-clamp-2' : ''}`}>
        {feedback.message}
      </p>

      {feedback.message && feedback.message.length > 150 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-forest-600 hover:text-forest-700 mt-2"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(feedback.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}</span>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {feedback.status === 'PENDING' && (
              <button
                onClick={() => onUpdateStatus?.(feedback.id, 'APPROVED')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            )}
            {feedback.status === 'PENDING' && (
              <button
                onClick={() => onUpdateStatus?.(feedback.id, 'SPAM')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Spam
              </button>
            )}
            <button
              onClick={() => onDelete?.(feedback)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function FeedbackCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-stone-200 rounded w-48" />
            <div className="h-3 bg-stone-200 rounded w-24" />
          </div>
        </div>
        <div className="h-6 bg-stone-200 rounded-full w-20" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="h-4 bg-stone-200 rounded w-3/4" />
      </div>
      <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between">
        <div className="h-3 bg-stone-200 rounded w-24" />
        <div className="h-8 bg-stone-200 rounded w-20" />
      </div>
    </div>
  );
}
