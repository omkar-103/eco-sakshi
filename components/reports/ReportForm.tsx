// components/reports/ReportForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Upload,
  X,
  Loader2,
  Camera,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { REPORT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';
import exifr from 'exifr';

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  publicId?: string;
  gpsData?: { latitude: number; longitude: number };
}

interface LocationData {
  coordinates: [number, number];
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default function ReportForm() {
  const router = useRouter();
  const { createReport, loading } = useReports();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'medium',
  });

  const [media, setMedia] = useState<MediaFile[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Get current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding using free API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          setLocation({
            coordinates: [longitude, latitude],
            address: data.display_name,
            city: data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
            pincode: data.address?.postcode,
          });
        } catch {
          setLocation({
            coordinates: [longitude, latitude],
          });
        }

        setLocationLoading(false);
      },
      (error) => {
        setLocationError(error.message);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (media.length + files.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    for (const file of files) {
      // Validate size
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        continue;
      }

      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        toast.error(`${file.name} is not a valid image or video`);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);

      // Extract GPS data from EXIF (images only)
      let gpsData: { latitude: number; longitude: number } | undefined;

      if (isImage) {
        try {
          const exif = await exifr.gps(file);
          if (exif?.latitude && exif?.longitude) {
            gpsData = { latitude: exif.latitude, longitude: exif.longitude };

            // Update location if not set
            if (!location) {
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${exif.latitude}&lon=${exif.longitude}`
                );
                const data = await response.json();

                setLocation({
                  coordinates: [exif.longitude, exif.latitude],
                  address: data.display_name,
                  city: data.address?.city || data.address?.town,
                  state: data.address?.state,
                  pincode: data.address?.postcode,
                });
              } catch {
                setLocation({
                  coordinates: [exif.longitude, exif.latitude],
                });
              }
            }
          }
        } catch {
          // EXIF extraction failed, continue without GPS
        }
      }

      setMedia((prev) => [
        ...prev,
        {
          file,
          preview,
          type: isVideo ? 'video' : 'image',
          uploading: false,
          uploaded: false,
          gpsData,
        },
      ]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

// Change return type to include the upload data
const uploadMedia = async (
  mediaFile: MediaFile,
  index: number
): Promise<{ success: boolean; url?: string; publicId?: string }> => {
  setMedia((prev) =>
    prev.map((m, i) => (i === index ? { ...m, uploading: true } : m))
  );

  try {
    const formData = new FormData();
    formData.append('file', mediaFile.file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    setMedia((prev) =>
      prev.map((m, i) =>
        i === index
          ? {
              ...m,
              uploading: false,
              uploaded: true,
              url: data.data.url,
              publicId: data.data.publicId,
            }
          : m
      )
    );

    // Return the data directly instead of just true/false
    return {
      success: true,
      url: data.data.url,
      publicId: data.data.publicId,
    };
  } catch (error) {
    console.error('Upload error:', error);
    setMedia((prev) =>
      prev.map((m, i) => (i === index ? { ...m, uploading: false } : m))
    );
    return { success: false };
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.title.trim()) {
    toast.error('Please enter a title');
    return;
  }

  if (!formData.description.trim()) {
    toast.error('Please enter a description');
    return;
  }

  if (!formData.category) {
    toast.error('Please select a category');
    return;
  }

  if (!location) {
    toast.error('Location is required');
    return;
  }

  setSubmitting(true);

  try {
    // Upload all media and collect results directly
    const uploadResults = await Promise.all(
      media.map(async (m, i) => {
        if (m.uploaded && m.url && m.publicId) {
          // Already uploaded, return existing data
          return {
            success: true,
            url: m.url,
            publicId: m.publicId,
            type: m.type,
            gpsData: m.gpsData,
          };
        }
        // Upload and get result directly
        const result = await uploadMedia(m, i);
        return {
          ...result,
          type: m.type,
          gpsData: m.gpsData,
        };
      })
    );

    // Check for failures
    if (uploadResults.some((r) => !r.success)) {
      toast.error('Some files failed to upload');
      setSubmitting(false);
      return;
    }

    // Build media array from upload results (not from stale state)
    const uploadedMedia = uploadResults
      .filter((r) => r.success && r.url)
      .map((r) => ({
        url: r.url!,
        publicId: r.publicId!,
        type: r.type,
        metadata: {
          gpsData: r.gpsData,
        },
      }));

    const result = await createReport({
      ...formData,
      location,
      media: uploadedMedia,
    } as any);

    router.push(`/citizen/reports/${result._id}?success=true`);
  } catch (error) {
    console.error('Submit error:', error);
  } finally {
    setSubmitting(false);
  }
};

  const isStepValid = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!formData.category;
      case 2:
        return !!formData.title.trim() && !!formData.description.trim();
      case 3:
        return !!location;
      default:
        return true;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['Category', 'Details', 'Location', 'Media'].map((label, index) => (
          <div key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => setStep(index + 1)}
              disabled={index + 1 > step && !isStepValid(step)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                step === index + 1
                  ? 'bg-forest-600 text-white'
                  : step > index + 1
                  ? 'bg-forest-100 text-forest-700'
                  : 'bg-sage-200 text-sage-500'
              )}
            >
              {step > index + 1 ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
            </button>
            <span
              className={cn(
                'ml-2 text-sm font-medium hidden sm:block',
                step === index + 1 ? 'text-forest-700' : 'text-sage-500'
              )}
            >
              {label}
            </span>
            {index < 3 && (
              <div
                className={cn(
                  'w-12 sm:w-24 h-1 mx-2 rounded-full',
                  step > index + 1 ? 'bg-forest-200' : 'bg-sage-200'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-semibold text-sage-900 font-display mb-2">
              What type of issue are you reporting?
            </h2>
            <p className="text-sage-600">
              Select the category that best describes the environmental issue.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.value })}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  formData.category === cat.value
                    ? 'border-forest-500 bg-forest-50'
                    : 'border-sage-200 hover:border-sage-300 hover:bg-sage-50'
                )}
              >
                <span className="text-lg font-medium text-sage-900">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.category}
              className="btn-primary"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-semibold text-sage-900 font-display mb-2">
              Describe the issue
            </h2>
            <p className="text-sage-600">
              Provide details to help authorities understand and address the problem.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief title for the issue"
                className="input-field"
                maxLength={200}
              />
              <p className="text-xs text-sage-500 mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue in detail. Include what you observed, when it started, and any other relevant information."
                className="input-field min-h-[150px] resize-none"
                maxLength={5000}
              />
              <p className="text-xs text-sage-500 mt-1">
                {formData.description.length}/5000 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Severity Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SEVERITY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: level.value })}
                    className={cn(
                      'p-3 rounded-xl border-2 text-center transition-all',
                      formData.severity === level.value
                        ? level.value === 'low'
                          ? 'border-green-500 bg-green-50'
                          : level.value === 'medium'
                          ? 'border-yellow-500 bg-yellow-50'
                          : level.value === 'high'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-sage-200 hover:border-sage-300'
                    )}
                  >
                    <span className="font-medium text-sage-900">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="btn-ghost">
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!formData.title.trim() || !formData.description.trim()}
              className="btn-primary"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-semibold text-sage-900 font-display mb-2">
              Where is the issue located?
            </h2>
            <p className="text-sage-600">
              We need the location to direct your report to the right authorities.
            </p>
          </div>

          <div className="card-bordered">
            {locationLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
                <span className="ml-3 text-sage-600">Getting your location...</span>
              </div>
            ) : locationError ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{locationError}</p>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="btn-outline"
                >
                  <Navigation className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            ) : location ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-forest-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sage-900">Location Captured</p>
                    <p className="text-sm text-sage-600 mt-1">
                      {location.address || `${location.coordinates[1]}, ${location.coordinates[0]}`}
                    </p>
                    {location.city && (
                      <p className="text-sm text-sage-500">
                        {location.city}, {location.state} {location.pincode}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="btn-ghost text-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                <div className="h-48 rounded-xl bg-sage-100 flex items-center justify-center">
                  <p className="text-sage-500">Map preview will appear here</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600 mb-4">Location not captured</p>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="btn-primary"
                >
                  <Navigation className="w-4 h-4" />
                  Get Current Location
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="btn-ghost">
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!location}
              className="btn-primary"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Media Upload */}
      {step === 4 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-semibold text-sage-900 font-display mb-2">
              Add photos or videos
            </h2>
            <p className="text-sage-600">
              Visual evidence helps verify and resolve issues faster.
            </p>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-sage-300 rounded-xl p-8 text-center cursor-pointer hover:border-forest-400 hover:bg-forest-50/50 transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-sage-500" />
            </div>
            <p className="text-sage-700 font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-sage-500 mt-1">
              Images (JPG, PNG, WebP) or Videos (MP4, WebM) up to 10MB each
            </p>
            <p className="text-xs text-sage-400 mt-2">Maximum 5 files</p>
          </div>

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {media.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-sage-100">
                    {item.type === 'image' ? (
                      <img
                        src={item.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.preview}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Overlay */}
                    {item.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}

                    {item.uploaded && (
                      <div className="absolute top-2 left-2">
                        <CheckCircle2 className="w-6 h-6 text-green-500 drop-shadow" />
                      </div>
                    )}

                    {item.gpsData && (
                      <div className="absolute bottom-2 left-2">
                        <MapPin className="w-5 h-5 text-white drop-shadow" />
                      </div>
                    )}

                    {/* Type indicator */}
                    <div className="absolute top-2 right-2">
                      {item.type === 'image' ? (
                        <ImageIcon className="w-5 h-5 text-white drop-shadow" />
                      ) : (
                        <Video className="w-5 h-5 text-white drop-shadow" />
                      )}
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(3)} className="btn-ghost">
              Back
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="btn-primary"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}