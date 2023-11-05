import { GoogleMap, Marker, LoadScript, InfoWindow, OverlayView } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'store';
import { getHub } from 'store/slices/hub';

function Map() {
    const dispatch = useDispatch();
    const [dataArray, setDataArray] = useState([]);
    const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(null);

    const infoWindowDelay = 1;
    const { hub } = useSelector((state) => state.hub);
    useEffect(() => {
        // Convert the hub data to the markers format
        const newMarkers = hub.map((item) => ({
            lat: item.hub_loc.coordinates[1],
            lng: item.hub_loc.coordinates[0]
        }));

        // Set the markers state with the newMarkers array
        setDataArray(newMarkers);
    }, [hub]);
    useEffect(() => {
        dispatch(getHub(''));
    }, []);
    const containerStyle = {
        width: '100%',
        height: '60vh',
        position: 'relative'
    };
    const initialCenter = {
        lat: 31.1048,
        lng: 77.1734
    };

    const [center, setCenter] = useState(initialCenter);
    const handleMarkerDragEnd = (event) => {
        setCenter({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    };
    return (
        <div>
            <LoadScript googleMapsApiKey="AIzaSyCw-n_vocju8_eYSa3f3jCh_P7J_EJJTtk">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    onClick={handleMarkerDragEnd}
                    options={{
                        mapTypeId: 'hybrid'
                    }}
                >
                    <OverlayView position={{ lat: 31.1197, lng: 77.1389 }} mapPaneName={OverlayView.OVERLAY_LAYER}>
                        <div
                            style={{
                                top: 0, // Set to 0 to position it at the top of the map
                                left: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '34px',
                                fontWeight: 'bold',
                                color: 'white',
                                zIndex: 999, // Set a higher z-index to ensure it's above the map elements
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'
                            }}
                        >
                            Hub Locations
                        </div>
                    </OverlayView>
                    {dataArray.map((marker, index) => (
                        <Marker
                            key={index}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            draggable
                            onDragEnd={handleMarkerDragEnd}
                            onMouseOver={() => {
                                const timerId = setTimeout(() => setHoveredMarkerIndex(index), infoWindowDelay);
                                return () => clearTimeout(timerId);
                            }}
                            onMouseOut={() => setHoveredMarkerIndex(null)}
                        />
                    ))}
                    {hoveredMarkerIndex !== null && (
                        <InfoWindow
                            position={{ lat: dataArray[hoveredMarkerIndex].lat, lng: dataArray[hoveredMarkerIndex].lng }}
                            onCloseClick={() => setHoveredMarkerIndex(null)}
                        >
                            <div>{hub[hoveredMarkerIndex].hubName}</div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
export default Map;
