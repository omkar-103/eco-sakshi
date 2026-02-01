'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Filter,
  X,
  MapPin,
  Loader2,
  Layers,
  Eye,
} from 'lucide-react';
import { cn, getCategoryLabel, getStatusLabel, formatRelativeTime } from '@/lib/utils/helpers';
import { REPORT_CATEGORIES, SEVERITY_LEVELS, REPORT_STATUSES } from '@/lib/utils/constants';
import Link from 'next/link';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons by severity
const createSeverityIcon = (severity: string) => {
  const colors: Record<string, string> = {
    critical: '#dc2626',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
  };

  const color = colors[severity] || colors.medium;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapComponentProps {
  reports: any[];
  center?: [number, number];
  zoom: number;
  height: string;
  showFilters: boolean;
  onMarkerClick?: (report: any) => void;
  selectedReportId?: string;
}

export default function MapComponent({
  reports,
  center = [20.5937, 78.9629], // India center
  zoom,
  height,
  showFilters,
  onMarkerClick,
  selectedReportId,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    severity: '',
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');
  const [isLoading, setIsLoading] = useState(true);

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (filters.status && report.status !== filters.status) return false;
      if (filters.category && report.category !== filters.category) return false;
      if (filters.severity && report.severity !== filters.severity) return false;
      return true;
    });
  }, [reports, filters]);

  // Valid reports with coordinates
  const validReports = useMemo(() => {
    return filteredReports.filter(
      (r) => r.location?.coordinates?.[0] && r.location?.coordinates?.[1]
    );
  }, [filteredReports]);

  const clearFilters = () => {
    setFilters({ status: '', category: '', severity: '' });
  };

  const hasActiveFilters = filters.status || filters.category || filters.severity;

  const tileLayers = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    },
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Create new map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
    });

    // Add tile layer
    L.tileLayer(tileLayers[mapStyle].url, {
      attribution: tileLayers[mapStyle].attribution,
    }).addTo(map);

    // Add zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;
    setIsLoading(false);

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update tile layer when style changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing tile layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add new tile layer
    L.tileLayer(tileLayers[mapStyle].url, {
      attribution: tileLayers[mapStyle].attribution,
    }).addTo(mapRef.current);
  }, [mapStyle]);

  // Update markers when reports change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    validReports.forEach((report) => {
      const marker = L.marker(
        [report.location.coordinates[1], report.location.coordinates[0]],
        { icon: createSeverityIcon(report.severity) }
      );

      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-mono text-green-700 bg-green-50 px-2 py-0.5 rounded">
              ${report.complaintId}
            </span>
          </div>
          <h3 class="font-semibold text-gray-900 text-sm mb-1">
            ${report.title}
          </h3>
          <p class="text-xs text-gray-600 mb-2">
            ${getCategoryLabel(report.category)} • ${formatRelativeTime(report.createdAt)}
          </p>
          ${report.location?.city ? `
            <p class="text-xs text-gray-500 mb-2">
              📍 ${report.location.city}, ${report.location.state || ''}
            </p>
          ` : ''}
          <a href="/citizen/reports/${report._id}" 
             class="text-xs font-medium text-green-600 hover:text-green-700 inline-flex items-center gap-1">
            View Details →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
      });

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(report));
      }

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Fit bounds if we have markers
    if (validReports.length > 0) {
      const bounds = L.latLngBounds(
        validReports.map((r) => [r.location.coordinates[1], r.location.coordinates[0]])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [validReports, onMarkerClick]);

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-sage-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
          <span className="ml-3 text-sage-600">Loading map...</span>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <>
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={cn(
              'absolute top-4 left-4 z-[1000] p-3 rounded-xl bg-white shadow-lg transition-all hover:shadow-xl',
              showFilterPanel && 'bg-forest-50',
              hasActiveFilters && 'ring-2 ring-forest-500'
            )}
          >
            <Filter className={cn('w-5 h-5', hasActiveFilters ? 'text-forest-600' : 'text-sage-600')} />
          </button>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="absolute top-4 left-16 z-[1000] w-72 bg-white rounded-xl shadow-xl p-4 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sage-900">Filter Reports</h3>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="p-1 rounded-lg hover:bg-sage-100"
                >
                  <X className="w-4 h-4 text-sage-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="input-field text-sm py-2"
                  >
                    <option value="">All Statuses</option>
                    {REPORT_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="input-field text-sm py-2"
                  >
                    <option value="">All Categories</option>
                    {REPORT_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="input-field text-sm py-2"
                  >
                    <option value="">All Severities</option>
                    {SEVERITY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-ghost text-sm w-full">
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-sage-200">
                <p className="text-xs font-medium text-sage-600 mb-2">Severity Legend</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Critical', color: '#dc2626' },
                    { label: 'High', color: '#f97316' },
                    { label: 'Medium', color: '#eab308' },
                    { label: 'Low', color: '#22c55e' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-sage-600">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Map Style Toggle */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={() => setMapStyle(mapStyle === 'street' ? 'satellite' : 'street')}
          className="p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all"
          title={mapStyle === 'street' ? 'Switch to Satellite' : 'Switch to Street'}
        >
          <Layers className="w-5 h-5 text-sage-600" />
        </button>
      </div>

      {/* Report Count Badge */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-xl shadow-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-forest-600" />
          <span className="text-sm font-medium text-sage-900">
            {validReports.length} report{validReports.length !== 1 ? 's' : ''}
          </span>
          {hasActiveFilters && (
            <span className="text-xs text-sage-500">
              (filtered from {reports.length})
            </span>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Custom Popup Styles */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          border: none !important;
          background: white !important;
          color: #414f44 !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f0f4f1 !important;
        }
        .leaflet-control-zoom-in {
          border-radius: 8px 8px 0 0 !important;
          margin-bottom: 1px !important;
        }
        .leaflet-control-zoom-out {
          border-radius: 0 0 8px 8px !important;
        }
      `}</style>
    </div>
  );
}