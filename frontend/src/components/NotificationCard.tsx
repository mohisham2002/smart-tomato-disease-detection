import { 
  AlertTriangle, 
  Info, 
  Megaphone,
  Trash2,
  Check,
  Edit2,
  Users
} from 'lucide-react';
import { NotificationDTO } from '../types/notification';

interface NotificationCardProps {
  notification: NotificationDTO;
  isAdmin?: boolean;
  onMarkRead?: (id: number) => void;
  onDelete?: (notification: NotificationDTO) => void;
  onEdit?: (notification: NotificationDTO) => void;
}

export function NotificationCard({ notification, isAdmin, onMarkRead, onDelete, onEdit }: NotificationCardProps) {
  const isRead = notification.isRead;
  
  const getTypeIcon = () => {
    switch (notification.type?.toUpperCase()) {
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'SUCCESS':
        return <Info className="w-5 h-5 text-green-500" />;
      case 'ERROR':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeStyles = () => {
    switch (notification.type?.toUpperCase()) {
      case 'WARNING':
        return 'border-l-amber-400 bg-amber-50/50';
      case 'SUCCESS':
        return 'border-l-green-400 bg-green-50/50';
      case 'ERROR':
        return 'border-l-red-400 bg-red-50/50';
      default:
        return 'border-l-blue-400 bg-blue-50/50';
    }
  };

  const getTypeBadge = () => {
    switch (notification.type?.toUpperCase()) {
      case 'WARNING':
        return 'bg-amber-100 text-amber-700';
      case 'SUCCESS':
        return 'bg-green-100 text-green-700';
      case 'ERROR':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl border border-stone-200 border-l-4 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-stone-300 ${
        getTypeStyles()
      } ${!isRead ? 'border-l-4' : 'opacity-75'}`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl ${isRead ? 'bg-stone-100' : 'bg-white shadow-sm'}`}>
            {getTypeIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold font-serif ${isRead ? 'text-stone-600' : 'text-stone-800'}`}>
                {notification.title}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeBadge()}`}>
                {notification.type || 'INFO'}
              </span>
              {notification.isBroadcast && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-forest-100 text-forest-700">
                  <Users className="w-3 h-3" />
                  Broadcast
                </span>
              )}
              {!isRead && (
                <span className="w-2 h-2 bg-forest-500 rounded-full" />
              )}
            </div>
            
            <p className="text-sm text-stone-600 mt-2 line-clamp-2">
              {notification.message}
            </p>
            
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-stone-400">
                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              
              {isAdmin ? (
                <>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(notification)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-forest-600 hover:text-forest-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(notification)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </>
              ) : (
                <>
                  {!isRead && onMarkRead && (
                    <button
                      onClick={() => onMarkRead(notification.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-forest-600 hover:text-forest-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark as read
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(notification)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {!isRead && (
            <div className="absolute top-3 right-3">
              <span className="w-2 h-2 bg-forest-500 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-stone-200 rounded-xl" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-stone-200 rounded w-3/4" />
          <div className="h-4 bg-stone-200 rounded w-full" />
          <div className="h-3 bg-stone-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
