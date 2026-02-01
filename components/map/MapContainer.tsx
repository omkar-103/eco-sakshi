'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl">
      <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
      <span className="ml-3 text-sage-600">Loading map...</span>
    </div>
  ),
});

interface MapContainerProps {
  reports?: any[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showFilters?: boolean;
  onMarkerClick?: (report: any) => void;
  selectedReportId?: string;
}

export default function MapContainer({
  reports = [],
  center,
  zoom = 5,
  height = '500px',
  showFilters = true,
  onMarkerClick,
  selectedReportId,
}: MapContainerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    // Force remount when reports change significantly
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Reset map when reports array reference changes
  useEffect(() => {
    if (isMounted) {
      setKey((prev) => prev + 1);
    }
  }, [reports.length]);

  if (!isMounted) {
    return (
      <div
        className="w-full flex items-center justify-center bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl"
        style={{ height }}
      >
        <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
        <span className="ml-3 text-sage-600">Loading map...</span>
      </div>
    );
  }

  return (
    <MapComponent
      key={key}
      reports={reports}
      center={center}
      zoom={zoom}
      height={height}
      showFilters={showFilters}
      onMarkerClick={onMarkerClick}
      selectedReportId={selectedReportId}
    />
  );
}