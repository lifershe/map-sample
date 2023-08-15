import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapboxGL, { Camera, PointAnnotation, ShapeSource, LineLayer } from '@rnmapbox/maps';
import * as turf from '@turf/turf'; // Import the correct @turf module
import accessToken from './access_token';

MapboxGL.setAccessToken(accessToken); // Replace with your Mapbox access token

const origin = [120.7494299, 15.0743624];
const direction = [120.7542876, 15.0630169];

const Mapview = () => {
  const mapRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);

  useEffect(() => {
    const calculatedDistance = turf.distance(
      turf.point(origin),
      turf.point(direction)
    );
    setDistance(calculatedDistance);

    // Fetch route data from Mapbox Directions API
    const fetchRoute = async () => {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${direction[0]},${direction[1]}?` +
          new URLSearchParams({
            geometries: 'geojson',
            access_token: accessToken,
          })
      );
      const data = await response.json();

      // Create a GeoJSON feature for the route
      const routeFeature = {
        type: 'Feature',
        geometry: data?.routes[0]?.geometry,
      };

      // Set the route GeoJSON
      setRouteGeoJSON(routeFeature);
    };

    fetchRoute();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map} styleURL={'mapbox://styles/mapbox/satellite-streets-v12'}>
            <Camera zoomLevel={13} centerCoordinate={origin} />

            {/* Route Line Layer */}
            {routeGeoJSON && (
              <ShapeSource id="routeSource" shape={routeGeoJSON}>
                <LineLayer id="routeLayer" style={styles.lineLayer} />
              </ShapeSource>
            )}

            {/* Origin Marker */}
            <PointAnnotation id="origin" coordinate={origin}>
              <View style={styles.annotationContainer}>
                <View style={styles.annotationFill} />
              </View>
            </PointAnnotation>

            {/* Destination Marker */}
            <PointAnnotation id="destination" coordinate={direction}>
              <View style={styles.annotationContainer}>
                <View style={styles.annotationFill} />
              </View>
            </PointAnnotation>
          </MapboxGL.MapView>
        </View>
      </View>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>
          Distance: {distance.toFixed(2)} kilometers
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  lineLayer: {
    lineColor: 'red',
    lineWidth: 5,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    elevation: 3,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  annotationFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 400,
    width: 500,
  },
  map: {
    flex: 1,
  },
});

export default Mapview;
