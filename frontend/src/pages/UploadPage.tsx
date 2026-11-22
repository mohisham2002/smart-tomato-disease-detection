import { useState, useEffect, useRef } from 'react';
import { ImagePlus, Search, RefreshCw, Image, Upload, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { LeafImageDTO } from '../types/leafImage';
import { leafImageService } from '../services/leafImageService';
import { detectionService } from '../services/detectionService';
import { predictionService, PredictionResponse } from '../services/predictionService';
import { LeafImageCard, LeafImageCardSkeleton } from '../components/LeafImageCard';

interface DetectionResult {
  diseaseName: string;
  displayName: string;
  confidence: number;
  result: string;
}

export function UploadPage() {
  const [images, setImages] = useState<LeafImageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<LeafImageDTO | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

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

    if (file.size > MAX_FILE_SIZE) {
      setError('Image is too large! Maximum allowed is 2MB only');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setError(null);
    setIsUploading(true);
    setDetectionResult(null);
    setSelectedImage(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const uploadedImage = await leafImageService.createLeafImage({
          imageName: file.name,
          imageData: base64,
          contentType: file.type,
          fileSize: file.size,
        });
        await fetchImages();
        setSelectedImage(uploadedImage);
        
        await performDetection(uploadedImage);
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

  const performDetection = async (image: LeafImageDTO) => {
    setIsDetecting(true);
    setError(null);
    try {
      // Call the backend prediction API
      const prediction = await predictionService.predict(image.imageData);
      
      setDetectionResult({
        diseaseName: prediction.displayName,
        displayName: prediction.displayName,
        confidence: prediction.confidence,
        result: prediction.result,
      });

      // Save the detection to history
      await detectionService.createDetection({
        imageName: image.imageName,
        imageData: image.imageData,
        diseaseName: prediction.displayName,
        confidence: prediction.confidence,
        result: prediction.result,
      });
    } catch (error) {
      console.error('Failed to perform detection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleDelete = async (image: LeafImageDTO) => {
    if (!confirm(`Delete "${image.imageName}"?`)) return;
    try {
      await leafImageService.deleteImage(image.id);
      await fetchImages();
      if (selectedImage?.id === image.id) {
        setSelectedImage(null);
        setDetectionResult(null);
      }
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

  const handleReDetect = async (image: LeafImageDTO) => {
    setSelectedImage(image);
    setDetectionResult(null);
    await performDetection(image);
  };

  const filteredImages = images.filter(
    (image) =>
      image.imageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResultIcon = (result: string) => {
    if (result === 'Healthy') {
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    }
    return <AlertTriangle className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Upload & Detect</h1>
          <p className="text-stone-500 mt-1">Upload leaf images for disease detection</p>
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
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-forest-600 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Upload & Detect
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'gallery'
              ? 'bg-forest-600 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Gallery ({images.length})
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="text-xl font-semibold text-stone-800 mb-4 font-serif">Upload New Image</h2>
            
            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 rounded-xl p-12 text-center cursor-pointer hover:border-forest-500 hover:bg-stone-50 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-full mb-4">
                  <ImagePlus className="w-10 h-10 text-stone-400" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Click to upload image</h3>
                <p className="text-stone-500">Support for JPG, PNG, WEBP images</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src={`data:${selectedImage.contentType};base64,${selectedImage.imageData}`}
                    alt={selectedImage.imageName}
                    className="w-full h-64 object-contain"
                  />
                  {isDetecting && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-2" />
                        <p className="font-medium">Analyzing image...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-800">{selectedImage.imageName}</p>
                    <p className="text-sm text-stone-500">
                      {(selectedImage.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => handleReDetect(selectedImage)}
                    disabled={isDetecting}
                    className="px-3 py-1.5 text-sm bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 disabled:opacity-50"
                  >
                    Re-detect
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="text-xl font-semibold text-stone-800 mb-4 font-serif">Detection Result</h2>
            
            {!selectedImage ? (
              <div className="text-center py-12 text-stone-400">
                <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Upload an image to see detection results</p>
              </div>
            ) : isDetecting ? (
              <div className="text-center py-12">
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-forest-600 animate-spin" />
                <p className="text-stone-600 font-medium">Analyzing leaf image...</p>
                <p className="text-sm text-stone-400 mt-1">This may take a few seconds</p>
              </div>
            ) : detectionResult ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                  {getResultIcon(detectionResult.result)}
                  <div>
                    <p className="text-sm text-stone-500">Result</p>
                    <p className={`text-2xl font-bold ${
                      detectionResult.result === 'Healthy' ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {detectionResult.result}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl">
                  <p className="text-sm text-stone-500 mb-1">Detected Disease</p>
                  <p className="text-xl font-semibold text-stone-800">{detectionResult.displayName}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-stone-500">Confidence</p>
                    <p className="font-medium text-stone-800">{(detectionResult.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        detectionResult.result === 'Healthy' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${detectionResult.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors"
                >
                  Upload Another Image
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <>
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
                  onReDetect={handleReDetect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
