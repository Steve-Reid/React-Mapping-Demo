# Interactive World Map with Mesh Connections

A React-based interactive world map application featuring 144 cities from around the globe with customizable mesh connection lines between all markers.

## Features

- **Interactive World Map**: Built with React Leaflet and OpenStreetMap tiles
- **144 Global Cities**: Comprehensive dataset covering all continents
- **Draggable Markers**: Move city markers to new positions with real-time coordinate logging
- **Mesh Connection Network**: Parallel connection lines between every pair of markers
- **Customizable Line Colors**: Each city has a `lineColor` property for individual line styling
- **Numbered Markers**: Custom green markers with city numbers and names
- **Configurable Styling**: Adjustable marker shadows and badges

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
src/
├── components/
│   └── WorldMap.js          # Main map component with mesh connections
├── data/
│   └── cities.js           # GeoJSON dataset of 144 cities
├── assets/
│   └── green-marker.png    # Custom marker icon
└── App.js                  # Main application component
```

## Data Structure

Each city in the dataset includes:
- `index`: Unique identifier
- `name`: City name
- `country`: Country name
- `population`: Population count
- `continent`: Continent classification
- `lineColor`: Hex color code for connection lines
- `coordinates`: [longitude, latitude] array

## Customization

### Line Colors
Modify the `lineColor` property in `src/data/cities.js` to change connection line colors:

```javascript
{
  properties: {
    index: 1,
    lineColor: '#ff6b6b',  // Custom hex color
    name: "New York City",
    // ... other properties
  }
}
```

### Marker Styling
Adjust marker appearance by modifying the `shadowConfig` and `badgeConfig` objects in `WorldMap.js`.

### Line Appearance
Customize connection lines by adjusting the Polyline properties:
- `weight`: Line thickness
- `opacity`: Line transparency
- `color`: Inherited from city data

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

## Technologies Used

- **React 17**: Frontend framework
- **React Leaflet**: Map integration
- **Leaflet**: Interactive mapping library
- **OpenStreetMap**: Map tile provider

## Features in Detail

### Mesh Connection Network
The application generates connection lines between every pair of cities, creating a comprehensive mesh network. With 144 cities, this creates thousands of interconnected lines, each colored according to the source city's `lineColor` property.

### Interactive Markers
- Drag markers to reposition cities
- Console logging of new coordinates
- Custom numbered icons with city names
- Configurable shadows and badges

### Performance Considerations
The mesh network renders efficiently using React Leaflet's Polyline components with optimized rendering and coordinate validation.
