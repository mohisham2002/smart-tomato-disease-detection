import { useState } from 'react';
import { 
  Leaf, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertTriangle,
  Save,
  X
} from 'lucide-react';
import { DetectionHistoryDTO } from '../types/detection';

interface DetectionCardProps {
  detection: DetectionHistoryDTO;
  onUpdate?: (id: number, notes: string, tags: string) => void;
  onDelete?: (detection: DetectionHistoryDTO) => void;
}

export function DetectionCard({ detection, onUpdate, onDelete }: DetectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(detection.notes || '');
  const [editTags, setEditTags] = useState(detection.tags || '');

  const isHealthy = detection.result === 'HEALTHY';
  const confidencePercent = Math.round(detection.confidence * 100);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(detection.id, editNotes, editTags);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditNotes(detection.notes || '');
    setEditTags(detection.tags || '');
    setIsEditing(false);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-forest-200 hover:-translate-y-1">
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        {detection.imageData ? (
          <img 
            src={`data:image/jpeg;base64,${detection.imageData}`} 
            alt={detection.imageName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-16 h-16 text-stone-300" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          {isHealthy ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              Healthy
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              {detection.diseaseName}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3">
          <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
            {confidencePercent}% confidence
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-stone-800 truncate font-serif">
              {detection.imageName}
            </h3>
            <p className="text-sm text-stone-500 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(detection.detectedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3 mt-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 resize-none"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Tags</label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Add tags (comma separated)"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {(detection.notes || detection.tags) && (
              <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                {detection.notes && (
                  <p className="text-sm text-stone-600">
                    <span className="font-medium">Notes:</span> {detection.notes}
                  </p>
                )}
                {detection.tags && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-stone-400" />
                    {detection.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-100 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-stone-600 hover:text-forest-600 hover:bg-forest-50 text-sm font-medium rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete?.(detection)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-stone-600 hover:text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function DetectionCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-stone-200" />
      <div className="p-5">
        <div className="h-5 bg-stone-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-stone-200 rounded w-1/2" />
        <div className="mt-4 pt-4 border-t border-stone-100 flex gap-2">
          <div className="h-8 bg-stone-200 rounded w-full" />
          <div className="h-8 bg-stone-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
