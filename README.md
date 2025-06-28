#Stage Locator System

A web-based application that helps users in busy cities or towns locate public vehicle stages and find bus routes to various destinations. Designed to make public transport more accessible, efficient, and convenient for commuters.


## Features

 **Stage Finder**: Locate nearby matatu/public vehicle stages by GPS or search.
**Route Discovery**: View available bus routes between origin and destination.
**Stage Details**: View key info like available vehicles, estimated waiting time, route fare, and schedule.
**Geolocation Support**: Uses map integration (e.g. Google Maps or OpenStreetMap).
**Directions**: Get walking or driving directions to the nearest stage.
**Authentication**: User registration and login system.
**Feedback System**: Allow users to report incorrect stage or route info.
**Responsive UI**: Mobile-friendly design for easy use on the go.
**Offline Access**: Cache routes and maps for use in areas with low internet coverage.

## Offline Access Module

The application now includes a comprehensive offline access module that allows users to:

- **Cache Routes and Maps**: Automatically cache stage and route data when online
- **Offline Search**: Search for stages and routes without internet connection
- **Offline Maps**: View cached map tiles and get directions offline
- **Smart Caching**: Intelligent cache management with user-configurable settings
- **Cache Management**: Preload data, monitor cache size, and clear cache as needed

For detailed documentation on the offline access module, see [Frontend/OFFLINE_ACCESS_README.md](Frontend/OFFLINE_ACCESS_README.md).

##Tech Stack

**Frontend:**
- React 
- Map integration ( Leaflet.js)
- Service Workers (for offline functionality)
- Cache API (for data caching)

**Backend:**
- Node.js + Express 
- RESTful API
- Authentication (JWT )

**Database:**
- MongoDB 
##Installation
   git clone https://github.com/masibili254/stage-locator-system.git
   cd stage-locator-system
