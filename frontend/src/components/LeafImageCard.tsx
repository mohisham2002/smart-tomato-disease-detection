import { useState } from 'react';
import { Trash2, Edit3, Download, Calendar, FileImage, ScanEye } from 'lucide-react';
import { LeafImageDTO } from '../types/leafImage';

interface LeafImageCardProps {
  image: LeafImageDTO;
  onDelete?: (image: LeafImageDTO) => void;
  onUpdate?: (id: number, description: string) => void;
  onReDetect?: (image: LeafImageDTO) => void;
}

export function LeafImageCard({ image, onDelete, onUpdate, onReDetect }: LeafImageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(image.description || '');

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(image.id, editDescription);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditDescription(image.description || '');
    setIsEditing(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:${image.contentType};base64,${image.imageData}`;
    link.download = image.imageName;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-forest-200">
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        {image.imageData ? (
          <img
            src={`data:${image.contentType};base64,${image.imageData}`}
            alt={image.imageName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileImage className="w-16 h-16 text-stone-300" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={handleDownload}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-stone-700 hover:bg-white transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {onReDetect && (
                <button
                  onClick={() => onReDetect(image)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-forest-600 hover:bg-white transition-colors"
                  title="Re-detect"
                >
                  <ScanEye className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-stone-700 hover:bg-white transition-colors"
                title="Edit"
              >
                <Edit3 className="w4" />
             -4 h- </button>
              <button
                onClick={() => onDelete?.(image)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add description..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-stone-100 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-stone-800 truncate font-serif" title={image.imageName}>
              {image.imageName}
            </h3>
            {image.description && (
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{image.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(image.uploadedAt).toLocaleDateString()}
              </span>
              <span>{formatFileSize(image.fileSize || 0)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function LeafImageCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-stone-200 rounded w-3/4" />
        <div className="h-4 bg-stone-200 rounded w-1/2" />
      </div>
    </div>
  );
}
