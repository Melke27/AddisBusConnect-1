import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { MapPin, Bus, Clock, ArrowRight } from "lucide-react";

// Sample route data with professional descriptions
const routes = [
  {
    id: 'r1',
    name: t('route1Name'),
    description: t('routeDescription1'),
    from: 'Meskel Square',
    to: 'Megenagna',
    duration: '25 min',
    status: 'on-time',
    color: 'red',
    stops: [
      'Meskel Square',
      'Mexico',
      'Sarbet',
      'Bole Medhanialem',
      'Megenagna'
    ]
  },
  {
    id: 'r2',
    name: t('route2Name'),
    description: t('routeDescription2'),
    from: 'Megenagna',
    to: 'Piazza',
    duration: '35 min',
    status: 'delayed',
    color: 'yellow',
    stops: [
      'Megenagna',
      'Meskel Square',
      'Piazza',
      'Arada',
      'Legehar'
    ]
  },
  {
    id: 'r3',
    name: t('route3Name'),
    description: t('routeDescription3'),
    from: 'Kality',
    to: 'Torhailoch',
    duration: '45 min',
    status: 'on-time',
    color: 'green',
    stops: [
      'Kality',
      'CMC',
      'Megenagna',
      'Meskel Square',
      'Torhailoch'
    ]
  },
  // Add more routes as needed
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on-time':
      return 'bg-green-100 text-green-800';
    case 'delayed':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Remove unused function since we're now using translations directly

const AllRoutes = () => {
  const { t } = useTranslation('routes');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('allRoutes')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <div 
            key={route.id}
            className={`border rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 ${
              route.color === 'red' ? 'border-red-500' : 
              route.color === 'yellow' ? 'border-yellow-500' : 
              'border-green-500'
            }`}
          >
            <div 
              className={`p-4 ${
                route.color === 'red' ? 'bg-red-500' : 
                route.color === 'yellow' ? 'bg-yellow-500' : 
                'bg-green-500'
              } text-white`}
            >
              <h2 className="text-xl font-bold">{route.name}</h2>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">{route.description}</p>
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <div className="flex-1">
                  <div className="font-medium">{route.from}</div>
                  <div className="text-sm text-gray-500">{t('startingPoint')}</div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <ArrowRight className="h-5 w-5 mr-2 text-gray-400" />
              </div>
              
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <div className="flex-1">
                  <div className="font-medium">{route.to}</div>
                  <div className="text-sm text-gray-500">{t('destination')}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{route.duration}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                  {t(route.status === 'on-time' ? 'onTime' : route.status === 'delayed' ? 'delayed' : 'cancelled')}
                </span>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">{t('stops')}:</h4>
                <ul className="text-sm space-y-1">
                  {route.stops.map((stop, index) => (
                    <li key={index} className="flex items-center">
                      <Bus className="h-3 w-3 mr-2 text-gray-400" />
                      {stop}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4">
                <Link 
                  to={`/routes/${route.id}`}
                  className={`inline-block w-full text-center py-2 px-4 rounded-md font-medium ${
                    route.color === 'red' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 
                    route.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 
                    'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRoutes;
