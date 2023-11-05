import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

function Map() {
    // const { cor, rcor } = props;
    // console.log('corjji', cor);
    // cor.split(',');
    // console.log(cor[0]);
    const containerStyle = {
        width: '100%',
        height: '400px'
    };
    const initialCenter = {
        lat: 31.1048,
        lng: 77.1734
    };

    const [center, setCenter] = useState(initialCenter);
    // useEffect(() => {
    //     if (cor[0] !== undefined) {
    //         const citycenter = {
    //             lat: parseFloat(cor[1]),
    //             lng: parseFloat(cor[0])
    //         };
    //         setCenter(citycenter);
    //         rcor(citycenter);
    //     }
    // }, [cor]);
    const handleMarkerDragEnd = (event) => {
        setCenter({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    };
    // rcor(center);
    return (
        <LoadScript googleMapsApiKey="AIzaSyCw-n_vocju8_eYSa3f3jCh_P7J_EJJTtk">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} onClick={handleMarkerDragEnd}>
                <Marker position={center} draggable onDragEnd={handleMarkerDragEnd} />
            </GoogleMap>
        </LoadScript>
    );
}
export default Map;
