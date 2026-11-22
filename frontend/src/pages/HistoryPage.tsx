import { useState, useEffect } from 'react';
import { History, Search, RefreshCw, Leaf, AlertCircle } from 'lucide-react';
import { DetectionHistoryDTO } from '../types/detection';
import { detectionService } from '../services/detectionService';
import { DetectionCard, DetectionCardSkeleton } from '../components/DetectionCard';

type FilterType = 'all' | 'healthy' | 'diseased';

export function HistoryPage() {
  const [detections, setDetections] = useState<DetectionHistoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchDetections();
  }, []);

  const fetchDetections = async () => {
    setLoading(true);
    try {
      const data = await detectionService.getMyDetections();
      setDetections(data);
    } catch (error) {
      console.error('Failed to fetch detections');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, notes: string, tags: string) => {
    try {
      await detectionService.updateDetection(id, { notes, tags });
      await fetchDetections();
    } catch (error) {
      console.error('Failed to update detection');
    }
  };

  const handleDelete = async (detection: DetectionHistoryDTO) => {
    if (!confirm(`Delete "${detection.imageName}"?`)) return;
    try {
      await detectionService.deleteDetection(detection.id);
      await fetchDetections();
    } catch (error) {
      console.error('Failed to delete detection');
    }
  };

  const filteredDetections = detections.filter((detection) => {
    const matchesSearch = 
      detection.imageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detection.diseaseName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'healthy') return matchesSearch && detection.result === 'HEALTHY';
    if (filter === 'diseased') return matchesSearch && detection.result !== 'HEALTHY';
    return matchesSearch;
  });

  const healthyCount = detections.filter(d => d.result === 'HEALTHY').length;
  const diseasedCount = detections.filter(d => d.result !== 'HEALTHY').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Detection History</h1>
          <p className="text-stone-500 mt-1">View and manage your leaf disease detections</p>
        </div>
        <button
          onClick={fetchDetections}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

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
              <History className="w-5 h-5 text-stone-600" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-stone-800">{detections.length}</p>
              <p className="text-sm text-stone-500">Total</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('healthy')}
          className={`p-4 rounded-xl border transition-all ${
            filter === 'healthy'
              ? 'bg-green-50 border-green-200 shadow-sm'
              : 'bg-white border-stone-200 hover:border-green-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-green-700">{healthyCount}</p>
              <p className="text-sm text-stone-500">Healthy</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('diseased')}
          className={`p-4 rounded-xl border transition-all ${
            filter === 'diseased'
              ? 'bg-red-50 border-red-200 shadow-sm'
              : 'bg-white border-stone-200 hover:border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-red-700">{diseasedCount}</p>
              <p className="text-sm text-stone-500">Diseased</p>
            </div>
          </div>
        </button>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search by image name or disease..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DetectionCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredDetections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-800 mb-1">No detections found</h3>
          <p className="text-stone-500">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Upload an image to start detecting diseases'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDetections.map((detection) => (
            <DetectionCard
              key={detection.id}
              detection={detection}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
