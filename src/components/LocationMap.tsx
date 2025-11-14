import { MapPin } from 'lucide-react';

interface LocationMapProps {
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
}

export function LocationMap({ location }: LocationMapProps) {
  const GOOGLE_MAPS_API_KEY = 'AIzaSyCzIR6tysUF1LhWNM-zUHVdjqX9ozVhfA0';
  const hasValidApiKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.length > 20;
  
  // Construct Google Maps embed URL using exact coordinates
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${location.lat},${location.lng}&zoom=15`;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div>
          <h4>{location.name}</h4>
          <p className="text-muted-foreground">{location.address}</p>
        </div>
      </div>

      <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden border border-border">
        {hasValidApiKey ? (
          <iframe
            title={`Map of ${location.name}`}
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Map Preview</p>
            <p className="text-sm text-muted-foreground max-w-md">
              To display an interactive map, add your Google Maps API key in the LocationMap component.
              Instructions are in the README.md file.
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-primary hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
