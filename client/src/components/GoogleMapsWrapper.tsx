import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { ReactNode } from "react";

const render = (status: Status): ReactNode => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>;
    case Status.FAILURE:
      return <div className="text-red-500 text-center p-4">Error loading Google Maps</div>;
    case Status.SUCCESS:
      return null;
  }
};

interface GoogleMapsWrapperProps {
  children: ReactNode;
}

export const GoogleMapsWrapper = ({ children }: GoogleMapsWrapperProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error("Google Maps API key is not set. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file");
    return <div className="text-red-500 p-4">
      Google Maps API key is not configured. Please check your environment variables.
    </div>;
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      {children}
    </Wrapper>
  );
};

export default GoogleMapsWrapper;
