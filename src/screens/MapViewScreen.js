import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {
  Callout,
  Circle,
  Geojson,
  Marker,
  Overlay,
  PROVIDER_GOOGLE,
  Polygon,
  Polyline,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

import requestLocationPermission from '../../utils/permissions/LocationPermission';

import ImgGoogle from '../../assets/images/ic_google.png';

const latlangArray = [
  {latitude: 21.233541509003437, longitude: 72.863882879308},
  {latitude: 21.232688138550035, longitude: 72.86378488412853},
  {latitude: 21.23397820176824, longitude: 72.86431059709086},
];

const myPlace = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'bridge',
        sym: 'Waypoint',
      },
      geometry: {
        type: 'Point',
        coordinates: [64.165329, 48.844287],
      },
    },
  ],
};

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebe3cd',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#523735',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f1e6',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#c9b2a6',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#dcd2be',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#ae9e90',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#93817c',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a5b076',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#447530',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f1e6',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fdfcf8',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f8c967',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#e9bc62',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e98d58',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#db8555',
      },
    ],
  },
  {
    featureType: 'road.local',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#806b63',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8f7d77',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#ebe3cd',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#b9d3c2',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#92998d',
      },
    ],
  },
];

const MapViewScreen = () => {
  const [markerCordinate, setMarkerCordinate] = useState({
    latitude: 21.233541509003437,
    longitude: 72.863882879308,
  });
  const [currentLocation, setCurrentLocation] = useState({});
  const [markerName, setMarkerName] = useState('');

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(position => {
      console.log('current position... ', position.coords);
      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  useEffect(() => {
    requestLocationPermission();
    getCurrentLocation();
    setInterval(() => {
      setMarkerCordinate(prev => {
        return {latitude: prev.latitude + 0.0005, longitude: prev.longitude};
      });
    }, 2000);
    
    return () => {
      clearInterval();
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude: 21.233541509003437,
          longitude: 72.863882879308,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        provider={PROVIDER_GOOGLE}
        // customMapStyle={mapStyle}
        mapType="standard"
        // showsTraffic={true}
        showsCompass={true}
        loadingEnabled={true}
        loadingIndicatorColor="blue"
        showsUserLocation={true}
        zoomControlEnabled={true}
        toolbarEnabled={true}
        onPoiClick={latlang => {
          console.log('.....on point click.. ', latlang.nativeEvent);
          setMarkerCordinate(latlang.nativeEvent.coordinate);
          setMarkerName(latlang.nativeEvent.name);
        }}

        // onUserLocationChange={newLocation => {
        //   console.log('new location... ', newLocation);
        // }}
      >
        <Marker
          draggable
          title={markerName}
          opacity={0.99}
          pinColor="red"
          description="new marker"
          coordinate={markerCordinate}>
          {/* <Callout>
            <TouchableOpacity>
              <Text>shruti</Text>
            </TouchableOpacity>
          </Callout> */}
        </Marker>
        <MapViewDirections
          origin={currentLocation}
          destination={markerCordinate}
          apikey="AIzaSyCg2a2TETOOCBew4hAdmlOzJclpitXZGmM"
          strokeColor="blue"
          strokeWidth={5}></MapViewDirections>
        {/* <Polyline
          coordinates={latlangArray}
          strokeWidth={2}
          strokeColor="red"
          zIndex={2}
          lineJoin="round"/> */}
        {/* <Circle
          center={{
            latitude: 21.233541509003437,
            longitude: 72.863882879308,
          }}
          radius={50}
          strokeWidth={3}
          strokeColor="black"
          fillColor="grey"
          zIndex={3}/> */}
        {/* <Geojson
            geojson={myPlace}
            strokeColor="red"
            fillColor="green"
            strokeWidth={2}
          /> */}
      </MapView>

      <Overlay
        image={ImgGoogle}
        bounds={[
          [21.232688138550035, 72.86378488412853],
          [21.233541509003437, 72.863882879308],
        ]}
        style={styles.overlayContainer}>
        <View style={styles.overlayView}>
          <Text style={styles.text}>Google Map</Text>
        </View>
      </Overlay>
    </View>
  );
};

export default MapViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapView: {width: '100%', height: '100%'},
  text: {color: 'black'},
  overlayContainer: {bottom: 30},
  overlayView: {
    backgroundColor: 'grey',
    padding: 10,
    borderColor: '#363636',
    borderRadius: 8,
    borderWidth: 2,
    opacity: 0.7,
  },
});
