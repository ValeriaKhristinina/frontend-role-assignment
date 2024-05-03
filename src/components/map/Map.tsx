import * as Leaflet from 'leaflet';
import { useEffect, useState } from 'react';
import './styles.css';
import Canvas from '../canvas/Canvas';

export const LEAFLET_OPTIONS = {
    zoomControl: true,
    loadingControl: true,
    attributionControl: false,
};

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibGVyYS1raHJpc3RpbmluYSIsImEiOiJjbHZxanc4aGcwMTZ2Mmptcm1xYWFlM2prIn0.ofwmdna6gZxQap7UHJyg7Q";

export default function Map() {
    const [map, setMap] = useState<Leaflet.Map | null>(null);

    useEffect(() => {
        setMap(() => {
            const leafletMap = Leaflet.map("mapid", LEAFLET_OPTIONS).setView(
              [55.6739075, 12.5692004],
              20
            );
        
            Leaflet.tileLayer(
              "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
              {
                tileSize: 512,
                zoomOffset: -1,
                id: "mapbox/streets-v9",
                accessToken: MAPBOX_TOKEN
              }
            ).addTo(leafletMap);
            return leafletMap;
          });
    }, []);

    return (
        <div id='mapid' className='map'>
            {map && <Canvas map={map} />}
        </div>
    );
}
