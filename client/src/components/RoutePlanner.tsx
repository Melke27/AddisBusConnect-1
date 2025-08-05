import React, { useState, useRef, Fragment } from 'react';
import { useLoadScript, GoogleMap, Marker, Autocomplete, InfoWindow } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import { IStop } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Google Maps setup
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'Your_API_Key_Here';
const libraries: ('places')[] = ['places'];
const mapContainerStyle = { width: '100%', height: '300px' };
const defaultCenter = { lat: 9.0320, lng: 38.7469 };

export default function RoutePlanner() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });
  const startAuto = useRef<google.maps.places.Autocomplete | null>(null);
  const endAuto = useRef<google.maps.places.Autocomplete | null>(null);

  const [startPos, setStartPos] = useState<{ lat: number; lng: number } | null>(null);
  const [endPos, setEndPos] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStop, setSelectedStop] = useState<IStop | null>(null);

  // Fetch bus stops from API
  const { data: stops = [] } = useQuery<IStop[]>({
    queryKey: ['stops'],
    queryFn: () => fetch('/api/stops').then(res => res.json()),
  });

  // Handlers for Autocomplete
  const onLoadStart = (autocomplete: google.maps.places.Autocomplete) => {
    startAuto.current = autocomplete;
  };
  const onPlaceChangedStart = () => {
    const place = startAuto.current?.getPlace();
    if (place?.geometry?.location) {
      setStartPos({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const onLoadEnd = (autocomplete: google.maps.places.Autocomplete) => {
    endAuto.current = autocomplete;
  };
  const onPlaceChangedEnd = () => {
    const place = endAuto.current?.getPlace();
    if (place?.geometry?.location) {
      setEndPos({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  if (loadError) {
    return <p>Error loading maps</p>;
  }
  if (!isLoaded) {
    return <p>Loading map…</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        {/* Start Autocomplete */}
        <div>
          <Label htmlFor="start">Start Location</Label>
          <Autocomplete onLoad={onLoadStart} onPlaceChanged={onPlaceChangedStart}>
            <Input id="start" placeholder="Enter start location" />
          </Autocomplete>
        </div>
        {/* End Autocomplete */}
        <div>
          <Label htmlFor="end">End Location</Label>
          <Autocomplete onLoad={onLoadEnd} onPlaceChanged={onPlaceChangedEnd}>
            <Input id="end" placeholder="Enter end location" />
          </Autocomplete>
        </div>
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={startPos || endPos || defaultCenter}
        zoom={13}
        onClick={(e) => {
          setEndPos({ lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 });
        }}
      >
        {/* Start Marker */}
        {startPos && (
          <Marker
            position={startPos}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
          />
        )}
        {/* End Marker */}
        {endPos && (
          <Marker
            position={endPos}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
          />
        )}
        {/* Bus Stop Markers */}
        {stops.map((stop) => (
          <Marker
            key={stop._id}
            position={{ lat: stop.latitude, lng: stop.longitude }}
            onClick={() => setSelectedStop(stop)}
          />
        ))}
        {/* InfoWindow for selected stop */}
        {selectedStop && (
          <InfoWindow
            position={{ lat: selectedStop.latitude, lng: selectedStop.longitude }}
            onCloseClick={() => setSelectedStop(null)}
          >
            <div>
              <h3 className="font-bold">{selectedStop.nameEn}</h3>
              <p className="text-sm">Routes served: TBD</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Station list */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Bus Stations</h2>
        <ul className="max-h-40 overflow-auto border rounded">
          {stops.map((stop) => (
            <li
              key={stop._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedStop(stop);
              }}
            >
              {stop.nameEn}
            </li>
          ))}
        </ul>
      </div>

      {/* Plan Button */}
      <div className="mt-4 flex justify-end">
        <Button onClick={() => console.log('Plan route', startPos, endPos)}>
          Plan Route
        </Button>
      </div>
    </div>
  );
}