import { useState, useEffect, useRef } from 'react';
import { ImagePlus, Search, RefreshCw, Image, Upload } from 'lucide-react';
import { LeafImageDTO } from '../types/leafImage';
import { leafImageService } from '../services/leafImageService';
import { LeafImageCard, LeafImageCardSkeleton } from '../components/LeafImageCard';

export function GalleryPage() {
  const [images, setImages] = useState<LeafImageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await leafImageService.getMyImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await leafImageService.createLeafImage({
          imageName: file.name,
          imageData: base64,
          contentType: file.type,
          fileSize: file.size,
        });
        await fetchImages();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (image: LeafImageDTO) => {
    if (!confirm(`Delete "${image.imageName}"?`)) return;
    try {
      await leafImageService.deleteImage(image.id);
      await fetchImages();
    } catch (error) {
      console.error('Failed to delete image');
    }
  };

  const handleUpdate = async (id: number, description: string) => {
    try {
      await leafImageService.updateImage(id, { description });
      await fetchImages();
    } catch (error) {
      console.error('Failed to update image');
    }
  };

  const filteredImages = images.filter(
    (image) =>
      image.imageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Gallery</h1>
          <p className="text-stone-500 mt-1">Manage your uploaded leaf images</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-50"
          >
            <Upload className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`} />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <button
            onClick={fetchImages}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <LeafImageCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-stone-100 rounded-full mb-6">
            <Image className="w-12 h-12 text-stone-400" />
          </div>
          <h3 className="text-xl font-semibold text-stone-800 mb-2 font-serif">
            {searchTerm ? 'No images found' : 'No images yet'}
          </h3>
          <p className="text-stone-500 mb-6 max-w-md mx-auto">
            {searchTerm
              ? 'Try adjusting your search'
              : 'Upload your first leaf image to get started with disease detection'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
              Upload First Image
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredImages.map((image) => (
            <LeafImageCard
              key={image.id}
              image={image}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
