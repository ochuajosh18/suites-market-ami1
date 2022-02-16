import React from 'react';
import { GoogleMap, Marker, StandaloneSearchBox, MarkerProps} from '@react-google-maps/api';
import { toastWarning } from '../../../modules/Toast';
import map from 'lodash/map';

interface BasicMapInterface {
    markerLabel: string;
    markers: Array<MarkerProps>;
    onMapClick?: (data: { lat: number, lng: number }) => void;
}

export default (props: BasicMapInterface) => {
    const [center, setCenter] = React.useState({
        lat: 14.275175,
        lng: 121.075125
    });
    const [searchbox, setSearchbox] = React.useState<StandaloneSearchBox | undefined>(undefined);

    const onLoad = React.useCallback(
        () => {
            // do something with load
            if (props.markers.length > 0) {
                setCenter(props.markers[0].position)
            }
            else {
                // no value
                if (navigator.geolocation) {
                    navigator.permissions
                        .query({ name: 'geolocation' })
                        .then(() => {
                            // geolocation fetch is possible
                            navigator.geolocation.getCurrentPosition(
                                (success) => {
                                    const { coords } = success;
                                    const crd = {
                                        lat: coords.latitude,
                                        lng: coords.longitude
                                    };
                                    setCenter(crd);
                                    if (props.onMapClick) {
                                        props.onMapClick(crd);
                                    }
                                },
                                (error) => {
                                    toastWarning("There was an issue in fetching your location, please check your browser permissions")
                                    console.log(error)
                                },
                                {
                                    maximumAge: Infinity,
                                    timeout: 5000,
                                    enableHighAccuracy: true
                                }
                            )
                        })
                }
            }
        },
        // eslint-disable-next-line
        []
    )

    const renderMarkers = () => {
        return map(props.markers, (marker: MarkerProps) => (
            <Marker
                position={marker.position}
                label={{
                    text: props.markerLabel.length > 0 ? props.markerLabel : ' ',
                    color: '#000',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    className: 'gmap-label',
                }}
            />
        ))
    }

    
    return (
            <GoogleMap
                mapContainerStyle={{ minHeight: 400, width: '100%', position: 'relative' }}
                onLoad={onLoad}
                zoom={17}
                center={center}
                clickableIcons={true}
                onClick={(e) => {
                    const { latLng: { lat, lng } } = e;
                    const data = {
                        lat: lat(),
                        lng: lng()
                    }

                    if (props.onMapClick) {
                        props.onMapClick(data)
                    }
                }}
            >
                <StandaloneSearchBox
                    onLoad={(searchBox) => {
                        setSearchbox(searchBox)
                    }}
                    onPlacesChanged={() => {
                        if (searchbox) {
                            // @ts-ignore
                            const places: any = searchbox.getPlaces()
                            if (places.length > 0) {
                                const geoloc = places[0].geometry.location;
                                setCenter({
                                    lat: geoloc.lat(),
                                    lng: geoloc.lng()
                                })
                            }
                        }
                    }}
                >
                    <input
                        style={{ 
                            position: 'absolute', 
                            top: 10, 
                            height: 40, 
                            right: 0, 
                            left: '50%', 
                            marginLeft: '-120px', 
                            width: 240, 
                            border: 'none', 
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                            boxSizing: 'border-box',
                            paddingLeft: '0.5rem!important'
                        }}
                    />
                </StandaloneSearchBox>
                {renderMarkers()}
            </GoogleMap>
    )
}