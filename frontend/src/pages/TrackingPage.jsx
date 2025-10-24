import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Play, Square, Home, Navigation, Clock, Gauge } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';

const TrackingPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [speed, setSpeed] = useState(0);
  const watchIdRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) return;

      const script = document.createElement('script');
      // Using a public API key for demo - replace with your own for production
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const initMap = () => {
      const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York
      
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
        styles: [
          {
            elementType: 'geometry',
            stylers: [{ color: '#0A1628' }],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#0A1628' }],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#34EDF3' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#1a2a3a' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#34EDF3', weight: 0.5 }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0d1f2d' }],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#152535' }],
          },
        ],
      });
    };

    // Wait for Google Maps to load
    const checkGoogleMaps = setInterval(() => {
      if (window.google) {
        initMap();
        clearInterval(checkGoogleMaps);
      }
    }, 100);

    return () => clearInterval(checkGoogleMaps);
  }, []);

  // Update marker on location change
  useEffect(() => {
    if (!currentLocation || !mapInstanceRef.current || !window.google) return;

    const position = {
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
    };

    if (markerRef.current) {
      markerRef.current.setPosition(position);
    } else {
      // Create custom marker icon
      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#34EDF3',
          fillOpacity: 1,
          strokeColor: '#F715AB',
          strokeWeight: 3,
        },
        animation: window.google.maps.Animation.DROP,
      });
    }

    mapInstanceRef.current.panTo(position);
  }, [currentLocation]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    toast.success('Tracking started');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        };

        setCurrentLocation(newLocation);
        setLocationHistory((prev) => [...prev, newLocation]);

        // Calculate speed (m/s to km/h)
        if (position.coords.speed !== null) {
          setSpeed((position.coords.speed * 3.6).toFixed(2));
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get location: ' + error.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    toast.info('Tracking stopped');
  };

  const formatCoordinate = (value) => {
    return value ? value.toFixed(6) : '0.000000';
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-cyan">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Live Tracker 3D</h1>
              <p className="text-xs text-muted-foreground">
                {isTracking ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    Tracking Active
                  </span>
                ) : (
                  'Ready to Track'
                )}
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-border/50 hover:bg-muted/20 transition-all duration-300"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Location Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Controls Card */}
            <Card className="glass p-6 border-border/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Controls
              </h3>
              <div className="space-y-3">
                {!isTracking ? (
                  <Button
                    onClick={startTracking}
                    className="w-full bg-gradient-primary text-white hover:opacity-90 shadow-glow-cyan transition-all duration-300 hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Tracking
                  </Button>
                ) : (
                  <Button
                    onClick={stopTracking}
                    variant="destructive"
                    className="w-full transition-all duration-300 hover:scale-105"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Tracking
                  </Button>
                )}
              </div>
            </Card>

            {/* Current Location Card */}
            <Card className="glass p-6 border-border/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Current Location
              </h3>
              {currentLocation ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Latitude</span>
                    <span className="text-sm font-mono text-foreground">
                      {formatCoordinate(currentLocation.latitude)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Longitude</span>
                    <span className="text-sm font-mono text-foreground">
                      {formatCoordinate(currentLocation.longitude)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Gauge className="w-4 h-4" />
                      Speed
                    </span>
                    <span className="text-sm font-mono text-primary">
                      {speed} km/h
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Updated
                    </span>
                    <span className="text-sm text-foreground">
                      {new Date(currentLocation.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-muted-foreground">
                    No location data yet.
                    <br />
                    Start tracking to see your location.
                  </p>
                </div>
              )}
            </Card>

            {/* Stats Card */}
            <Card className="glass p-6 border-border/30">
              <h3 className="text-lg font-semibold mb-4">Session Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-2xl font-bold text-primary">
                    {locationHistory.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Data Points</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-2xl font-bold text-secondary">
                    {speed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Speed (km/h)</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card className="glass p-4 border-border/30 h-[calc(100vh-180px)]">
              <div
                ref={mapRef}
                className="w-full h-full rounded-lg overflow-hidden shadow-inner"
                style={{ minHeight: '500px' }}
              >
                {/* Map loads here */}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;